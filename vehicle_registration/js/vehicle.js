import { supabase } from './supabaseClient.js'

console.log("Step 1: vehicle.js Script Loaded!");

const searchForm = document.getElementById("searchForm");
if (!searchForm) {
    console.error("ERROR: Could not find <form id='searchForm'> in vehicle.html");
}

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    console.log("Step 2: Vehicle Search Button Clicked!");

    const rego = document.getElementById("rego").value.trim()
    const message = document.getElementById("message")
    const results = document.getElementById("results")

    results.innerHTML = ""

    if (!rego) {
        message.innerText = "Error: Please enter a registration number."
        return
    }

    console.log("Step 3: Fetching Vehicle data for Rego:", rego);

    // Note: 'Vehicle' and 'People' must be Capitalized to match your SQL                                            //
    const allData = await supabase.from("vehicle").select("*");
    console.log("DATABASE CHECK - All rows in table:", allData.data);
    const { data, error } = await supabase
        .from("vehicle")
        .select("*, people(*)")
        .eq("rego", rego)

    if (error) {
        console.error("Supabase Error:", error.message);
        message.innerText = "Error: " + error.message;
        return;
    }

    console.log("Step 4: Data received from Supabase:", data);

    if (!data || data.length === 0) {
        message.innerText = "No result found"
    } else {
        message.innerText = "Search successful"

        data.forEach(v => {
            const div = document.createElement("div")
            // Accessing the joined table 'People' (Capital P)
            const ownerName = v.people?.name || "Unknown Owner";
            div.innerText = `${v.make} ${v.model} (${v.colour}) - Owner: ${ownerName}`;
            results.appendChild(div)
        })
    }
})