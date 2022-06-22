const urlRoot = "http://localhost:3000";
const heroList = document.querySelector(".hero-list-group");

// Buttons
const getPost = document.querySelector(".get-post");
const addPost = document.querySelector(".add-post-form");
const editPost = document.querySelector(".edit-post");

const lastName = document.querySelector("#lastName");
const firstName = document.querySelector("#firstName");
const heroName = document.querySelector("#heroName");

class heroesList {
  constructor(id, lastName, firstName, heroName) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.heroName = heroName;
  }
  bringInfo() {
    return [this.id, this.lastName, this.firstName, this.heroName];
  }
}

const heroArray = [];
const heroURL = "http://localhost:3000/heroes";
let output = "";

// GET

getPost.addEventListener("click", () => {
  fetch(heroURL, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((responseJSON) => {
      console.log("Raspuns de tip JSON:", responseJSON);
      output = "";
      responseJSON.forEach((hero, index) => {
        console.log(`The hero from index ${index} is ${hero.heroName}`);
        heroArray.push(new heroesList(hero.id, hero.lastName, hero.firstName, hero.heroName));
        output += `
      <div class="hero-card card m-3">
      <div class="card-body" data-id=${hero.id}>
          <h2>${hero.heroName}</h2>
          <h3>Real name: ${hero.firstName} ${hero.lastName}</h3>
          <button class="btn btn-success edit-post" id="hero-id-${hero.id} "data-bs-toggle="modal" data-bs-target="#editHeroModal">EDIT</button>
          <button class="btn btn-danger delete-post" id="delButton">DELETE</button>
      </div>
      </div><br>
      `;
        heroList.innerHTML = output;
      });

      const editAllButtons = document.querySelectorAll(".edit-post");
      console.log("Edit all buttons:", editAllButtons);
      editAllButtons.forEach((button) => {
        button.addEventListener("click", triggerEditFlow);
      });
      console.log("Hero Array:", heroArray);
    });
});

// UPDATE

function triggerEditFlow(event) {
  //get hero id
  const id = Number(event.target.id.split("-").at(-1));
  //Get selected hero
  const selectedHero = heroArray.find((hero) => hero.id === id);
  const modalBody = document.querySelector("#generateForm");
  modalBody.innerHTML = generateForm(selectedHero);
  const saveButton = document.querySelector("#saveEditedHero");
  saveButton.addEventListener("click", () => {
    submitHeroChanges(id);
  });

  console.log("Selected Hero:", selectedHero);
}

function submitHeroChanges(id) {
  const form = document.querySelector("#generateForm");
  console.dir("Hero Form:", form);
  const lastName = document.querySelector("#lastName");
  const firstName = document.querySelector("#firstName");
  const heroName = document.querySelector("#heroName");
  const patchURL = `http://localhost:3000/heroes/${id}`;
  console.log({ lastName, firstName, heroName, id });
  fetch(patchURL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lastName: lastName.value,
      firstName: firstName.value,
      heroName: heroName.value,
    }),
  }).then((response) => response.json());
  const Data = Promise(fetch);
  console.log(Data);
  Data.then((response) => console.log(response)).then(() => location.reload());
}

function generateForm(hero) {
  return `
  <form class="add-post-form" >
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="lastName"
            placeholder="Write last name"
            value="${hero.lastName}"
            required
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="firstName"
            placeholder="Write first name"
            value="${hero.firstName}"
            required
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="heroName"
            placeholder="Write hero name"
            value="${hero.heroName}"
            required
          />
        </div>
      </form>
  `;
}

//POST
addPost.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Form submited");
  fetch(heroURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lastName: lastName.value,
      firstName: firstName.value,
      heroName: heroName.value,
    }),
  })
    .then((response) => {
      console.log(response.json());
      return response.json();
    })
    .catch((err) => {
      console.log("Catch me if you can:", err);
    });
});

// DELETE

heroList.addEventListener("click", (e) => {
  e.preventDefault();
  let pressDeleteButton = e.target.id == "delButton";
  let id = e.target.parentElement.dataset.id;
  // console.log("The hero id is:", e.target.parentElement.dataset.id);
  if (pressDeleteButton) {
    console.log("removed hero");
    fetch(`http://localhost:3000/heroes/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => location.reload());
  }
});
