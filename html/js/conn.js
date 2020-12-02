
////////// GLOBAL ///////////////////////////////////

let G = {
  elec: require(`electron`)
}

G.elec.ipcRenderer.on(`console`, (evt, data) => {
  let console = query(`#console`);
  console.innerHTML = query(`#console`).innerHTML+`<br>`+data;
  console.scrollTop = console.scrollHeight;
})
G.elec.ipcRenderer.on(`unlock`, () => {
  locked = false;
})
let assignments, trelloData;
G.elec.ipcRenderer.on(`assignments`, (evt, data) => {
  assignments = data.pack, trelloData = data.data;
  $(`#list-assignments`).empty()
  $(`#list-container p`).css({display:`none`})
  for (i in assignments) {
    $(`#list-assignments`).append(`<li><h1>${assignments[i].name}</h1><p>${assignments[i].due}</p><img src="./assets/remove.png" onclick="dropAssignment(${i})"></li>`)
  }
  if (assignments.length) {
    $(`#action-pushTrello`).css({backgroundColor: `rgb(0, 127, 255)`})
  } else {
    $(`#action-pushTrello`).css({backgroundColor: `rgb(195, 195, 195)`})
  }
})
const pushTrello = () => {
  console.log(locked, trelloData);
  if (!locked && trelloData) {
    locked = true;
    $(`#action-pushTrello`).css({backgroundColor: `rgb(195, 195, 195)`})
    G.elec.ipcRenderer.send(`pushTrello`, {assignments: assignments, data: trelloData});
  }
}
const dropAssignment = id => {
  assignments.splice(id, 1)
  $(`#list-assignments`).empty()
  $(`#list-container p`).css({display:`none`})
  for (i in assignments) {
    $(`#list-assignments`).append(`<li><h1>${assignments[i].name}</h1><p>${assignments[i].due}</p><img src="./assets/remove.png" onclick="dropAssignment(${i})"></li>`)
  }
  if (assignments.length) {
    $(`#action-pushTrello`).css({backgroundColor: `rgb(0, 127, 255)`})
  } else {
    $(`#action-pushTrello`).css({backgroundColor: ` rgb(195, 195, 195)`})
  }
};
G.elec.ipcRenderer.on(`data`, (evt, data) => {
  query(`#teams-email`).value = data.teams.email;
  query(`#teams-pass`).value = data.teams.pass;
  query(`#trello-key`).value = data.trello.key;
  query(`#trello-token`).value = data.trello.token;
  query(`#trello-board`).value = data.trello.board;
  query(`#trello-task`).value = data.trello.task;
  query(`#trello-template`).value = data.trello.template;
})

setTimeout(() => G.elec.ipcRenderer.send(`getData`), 4000)

///////// FUNCTIONS //////////////////////////////////

const getTeams = async () => {
  if (!locked) {
    locked = true;
    let pack = {
      teams: {
        email: query(`#teams-email`).value,
        pass: query(`#teams-pass`).value
      },
      trello: {
        key: query(`#trello-key`).value,
        token: query(`#trello-token`).value,
        board: query(`#trello-board`).value,
        task: query(`#trello-task`).value,
        template: query(`#trello-template`).value
      }
    };
    if (allow) G.elec.ipcRenderer.send(`getTeams`, pack);
    $(`#list-assignments`).empty()
    $(`#list-container p`).css({display:`block`})
  }
}