
module.exports = {
    global: async () => {

        ////////// GLOBAL ////////////////////////////////////////

        let G = {
            node: {
                express: require(`express`),
                http: require(`http`),
                json: require(`jsonfile`),
                io: require(`socket.io`)
            }
        };
        G.config = G.node.json.readFileSync(`./config.json`), G.db = G.node.monk(G.config.db, {authSource: "admin"});
        
        ////////// EXPRESS ////////////////////////////////////////

        const exp = G.node.express();
        const site = G.node.http.Server(exp);
        exp.get(`/`, (err, data) => { data.sendFile(__dirname + G.config.site.root + G.config.site.file) })
        exp.use(G.config.site.root, G.node.express.static(__dirname + G.config.site.root))
        site.listen(G.config.site.port)

        ////////// SOCKET ////////////////////////////////////////

        G.sockets = G.node.io(site, {});

        ////////// RETURN ////////////////////////////////////////

        console.log(`Tealo is online!`)
        return G;
    }
}