
// SAVE AREA
//
// Width: 558 px
// Height: 451 px

const master = async () => {

    ////////// HANDLE ////////////////////////////////////////

    let G = await require(`./handle.js`).global();

    ////////// SOCKET ////////////////////////////////////////
    
    G.sockets.on(`connection`, socket => {
        socket.on(`browser`, (parse) => console.log(parse))
    })

}; master()
  
  
  