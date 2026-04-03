import { supabase } from './supabaseClient.js'

console.log("Step 1: people.js Script Loaded!");
const searchForm = document.getElementById("searchForm");
if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const license = document.getElementById("license").value.trim();
        const message = document.getElementById("message");
        const results = document.getElementById("results");

        console.log(`Step 2: Search initiated. Name: "${name}", License: "${license}"`);

        // Clear previous results
        results.innerHTML = "";
        message.innerText = "Searching...";

        // // Improved Logic: Just check if at least one field is filled
        // if (!name && !license) {
        //     message.innerText = "Error: Please enter a Name or a License number.";
        //     console.warn("Search blocked: Both fields are empty.");
        //     return;
        // }

        // Inside your search function
        if ((!name && !license) || (name && license)) {
            message.innerText = "Error"; // Exact text required [cite: 232]
            results.innerHTML = "";
            return;
        }


        try {
            console.log("Step 3: Fetching from Supabase...");
            
            // Start the query on the 'people' table
            let query = supabase.from("people").select("*");

            // Filter based on which field was filled
            if (name) {
                query = query.ilike("name", `%${name}%`);
            } 
            
            if (license) {
                query = query.eq("license", license);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            console.log("Step 4: Data received:", data);

            if (!data || data.length === 0) {
                message.innerText = "No result found";
            } else {
                message.innerText = `Search successful (${data.length} found)`;

                data.forEach(p => {
                    const div = document.createElement("div");
                    div.style.border = "1px solid #ddd";
                    div.style.padding = "10px";
                    div.style.margin = "10px 0";
                    div.innerHTML = `
                        <strong>Name:</strong> ${p.name} <br>
                        <strong>License:</strong> ${p.license} <br>
                        <strong>Address:</strong> ${p.address} <br>
                        <strong>DOB:</strong> ${p.dob}
                    `;
                    results.appendChild(div);
                });
            }
        } catch (error) {
            console.error("Supabase Error:", error.message);
            message.innerText = "Error: " + error.message;
        }
    });
} else {
    console.error("Error: Could not find 'searchForm' in the HTML.");
}