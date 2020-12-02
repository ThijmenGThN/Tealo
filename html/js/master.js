
window.onload = () => setTimeout(() => document.querySelector(`#load`).style.display = `none`, 3000)

let allow, locked, el = [`trello-key`,`trello-token`,`trello-board`,`trello-task`,`trello-template`,`teams-email`,`teams-pass`];
const query = (query) => { return document.querySelector(query) };
const queryAll = (query) => { return document.querySelectorAll(query) };

setInterval(() => {
  allow = true;

  for (i in el) {
    if (!document.querySelector(`#`+el[i]).value) allow = false;
  }
  
  if (allow) {
    queryAll(`#auth div span`).forEach(span => span.style.display = `none`);
    query(`#menu-auth div`).style.display = `none`;

    query(`#action-getTeams`).style.backgroundColor = `rgb(76, 0, 255)`;

    query(`.auth-form button`).style.backgroundColor = `black`;
  } else {
    queryAll(`#auth div span`).forEach(span => span.style.display = `block`);
    query(`#menu-auth div`).style.display = `block`;

    query(`.auth-form button`).style.backgroundColor = `rgb(206, 206, 206)`;
    query(`#action-getTeams`).style.backgroundColor = `rgb(0, 0, 0)`;
  }

  if (locked) {
    query(`#action-getTeams`).style.backgroundColor = `rgb(195, 195, 195)`;
  }
}, 500)

const goTo = (to) => {
  if (to == `auth`) {
    query(`#auth`).style.top = `0`;
    query(`#run`).style.top = `100vh`;

    query(`#menu-auth`).style.backgroundColor = `rgb(60,70,80)`;
    query(`#menu-run`).style.backgroundColor = `rgb(50,60,70)`;
  } else if (to == `run`) {
    query(`#auth`).style.top = `-100vh`;
    query(`#run`).style.top = `0`;

    query(`#menu-run`).style.backgroundColor = `rgb(60,70,80)`;
    query(`#menu-auth`).style.backgroundColor = `rgb(50,60,70)`;
  }
}










