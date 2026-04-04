import { supabase } from './supabaseClient.js'

console.log("Step 1: addVehicle.js Script Loaded!");
let selectedOwnerId = null
const ownerInput = document.getElementById("owner")
const checkBtn = document.getElementById("checkOwner")
const newOwnerBtn = document.getElementById("newOwnerBtn")
const ownerResults = document.getElementById("owner-results")

// Enable check button only when text is entered
ownerInput.addEventListener("input", () => {
    checkBtn.disabled = !ownerInput.value.trim()
})


// ownerInput.addEventListener('input', () => {
//     if (ownerInput.value.trim() !== "") {
//         checkOwnerBtn.disabled = false;
//     } else {
//         checkOwnerBtn.disabled = true;
//     }
// })


// CHECK EXISTING OWNER
checkBtn.onclick = async () => {
    console.log("Step 2: Checking for existing owner...");
    newOwnerBtn.disabled = false
    const name = ownerInput.value.trim()

    const { data, error } = await supabase
        .from("people") 
        .select("*")
        .ilike("name", `%${name}%`)

    ownerResults.innerHTML = ""

    if (error) {
        console.error("Error fetching owner:", error.message);
        return;
    }

    if (!data || data.length === 0) {
        ownerResults.innerText = "No owner found. You may need to create a New Owner."
        return
    }

    data.forEach(p => {
        const div = document.createElement("div")
        div.style.border = "1px solid #ccc";
        div.style.margin = "5px";
        div.style.padding = "5px";
        div.innerText = `${p.name} (License: ${p.license})`;

        const btn = document.createElement("button")
        btn.innerText = "Select This Owner"
        btn.onclick = () => {
            selectedOwnerId = p.personid; 
            console.log("Step 3: Owner Selected! ID:", selectedOwnerId);
            ownerResults.innerHTML = `<strong>Selected: ${p.name}</strong>`;
        }

        div.appendChild(btn)
        ownerResults.appendChild(div)
    })
}

// SHOW NEW OWNER FORM
newOwnerBtn.onclick = () => {
    document.getElementById("newOwnerForm").style.display = "block"
}

// ADD NEW OWNER
document.getElementById("addOwner").onclick = async () => {
    console.log("Step 4: Adding new owner to database...");
    const name = document.getElementById("name").value
    const address = document.getElementById("address").value
    const dob = document.getElementById("dob").value
    const license = document.getElementById("license").value
    const expire = document.getElementById("expire").value

    if (!name || !address || !dob || !license || !expire) {
        document.getElementById("message-owner").innerText = "Error: All fields required."
        return
    }

    const { data, error } = await supabase
        .from("people")
        .insert([{ name, address, dob, license, expire }])
        .select()

    if (error) {
        console.error("Error adding owner:", error.message);
        document.getElementById("message-owner").innerText = "Error: " + error.message;
    } else {
        selectedOwnerId = data[0].personid;
        console.log("Step 5: New Owner created with ID:", selectedOwnerId);
        document.getElementById("message-owner").innerText = "Owner added successfully!";
        document.getElementById("newOwnerForm").style.display = "none";
        ownerResults.innerHTML = `<strong>Selected: ${name}</strong>`;
    }
}

//  ADD VEHICLE
document.getElementById("addVehicle").onclick = async () => {
    console.log("Step 6: Attempting to add vehicle...");
    const rego = document.getElementById("rego").value
    const make = document.getElementById("make").value
    const model = document.getElementById("model").value
    const colour = document.getElementById("colour").value

    const msg = document.getElementById("message-vehicle");

    if (!rego || !make || !model || !colour || !selectedOwnerId) {
        msg.innerText = "Error: Ensure all vehicle fields are filled AND an owner is selected."
        console.warn("Blocked: Missing fields or selectedOwnerId is null");
        return
    }
    const { error } = await supabase.from("vehicle").insert([
        { rego, make, model, colour, ownerid: selectedOwnerId }
    ])

    if (error) {
        console.error("Error adding vehicle:", error.message);
        msg.innerText = "Error: " + error.message;
    } else {
        console.log("Step 7: Vehicle Added Successfully!");
        msg.innerText = "Vehicle added successfully!";
        
        // Clear fields after success
        document.getElementById("rego").value = ""
        document.getElementById("make").value = ""
        document.getElementById("model").value = ""
        document.getElementById("colour").value = ""
    }
}
