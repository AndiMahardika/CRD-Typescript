import { fetchData } from "./libs/fecth";
import { IContacts } from "./types/entity";

const URL_API = "https://v1.appbackend.io/v1/rows/Semu84edrdnj";

interface IContactResult {
  data: IContacts[];
}

// render contacts
async function renderContacts() {
  const contacts = await fetchData<IContactResult>(URL_API);

  if (!contacts) {
    console.log("Data Error");
    return;
  }

  const divContacts = document.querySelector(".list-contacts") as HTMLDivElement;
  let card: any = "";
  contacts.data.forEach((contact) => {
    card += cardContact(contact);
  });
  divContacts.innerHTML = card;  

  const buttonDetails = document.querySelectorAll('#btn-detail')
  buttonDetails.forEach(el => el.addEventListener('click', async (event) => {
    const id = (event.target as HTMLButtonElement).dataset.id;
    await detailContact(id as string);
  }))

  const buttonDelete = document.querySelectorAll('#btn-delete')
  buttonDelete.forEach(el => el.addEventListener('click', async (event) => {
    if(confirm('Are you sure?')){
      const id = (event.target as HTMLButtonElement).dataset.id ; 
      await deleteContact(id as string);
    }
  }))
}

renderContacts();

// add contact
const formInput = document.getElementById("input-contact");
const nameInput = document.getElementById("name") as HTMLInputElement;
const phoneInput = document.getElementById("phone") as HTMLInputElement;
const genderInput = document.getElementById("gender") as HTMLSelectElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const addressInput = document.getElementById("address") as HTMLTextAreaElement;

formInput?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value;
  const phone = phoneInput.value;
  const gender = genderInput.value;
  const email = emailInput.value;
  const address = addressInput.value;
  let avatar: string;

  if (gender === "male") {
    avatar =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Mars-male-symbol-pseudo-3D-blue.svg/1200px-Mars-male-symbol-pseudo-3D-blue.svg.png";
  } else {
    avatar =
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Venus-female-symbol-pseudo-3D-pink.svg";
  }

  try {
    fetch(URL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ name, phone, gender, email, address, avatar }]),
    }).then((response) => {
      if (response.ok) {
        console.log("Contact added successfully");
        window.location.reload();
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// delete contact
async function deleteContact(id: string) {
  fetch(URL_API , {
    method: "DELETE",
    headers: {
          'Content-Type': 'application/json'
    },
    body: JSON.stringify([id])
  }).then((response) => {
    if (response.ok) {
      window.location.reload();
    }
  })
}

// detail contact
async function detailContact(id: string) {
  try {
    const response = await fetch(URL_API + `/${id}`);
    const data = (await response.json()) as IContacts;

    const divDetail = document.querySelector(".detail-contacts") as HTMLDivElement;
    const detail = cardDetail(data);
    divDetail.innerHTML = detail;
  } catch (error) {
    console.log(error);
  }
}

function cardContact(data: any){
  return `<div class="card">
            <img src=${data.avatar} alt="" srcset="" >
            <div class="content">
              <h3>${data.name}</h3>
              <h4 class="phone">${data.phone}</h4>
              <p class="address">${data.address}</p>
              <div class="button-group">
                <button data-id=${data._id} id="btn-detail">detail</button>
                <button data-id=${data._id} id="btn-delete">delete</button>
              </div>
            </div>
          </div>`
}

function cardDetail(data: any){
  return `<table>
            <tr>
              <th>Name</th>
              <td class="name">${data.name}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td class="phone">${data.phone}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td class="gender">${data.gender}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td class="email">${data.email}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td class="address">${data.address}</td>
            </tr>
          </table>`
}