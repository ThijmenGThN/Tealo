console.clear()
console.log(`Tealo`)

////////// GLOBAL ////////////////////////////////////////

let G = {
    Trello: require(`trello`),
    json: require(`jsonfile`),
    web: require(`puppeteer`),
    elec: require(`electron`),
    encryptor: require(`simple-encryptor`)("L!~Spw^THy`FtV%tx{*{aU91]O0`yf(OB`TZ|9<v_i#sKRvZ$,hB&]jT_mULd;?")
}

////////// PUPPETEER ////////////////////////////////////////

const teams = async (data, evt) => {
    try {
        evt.reply(`console`, `Loading assignments from Teams..`)
        const browser = await G.web.launch({headless: true});
        const page = await browser.newPage();

        evt.reply(`console`, `Authenticating..`)
        await page.goto(`https://adfs3prod.aventus.nl/adfs/ls/?client-request-id=089db677-3922-4b5c-af7f-bb21c4680173&wa=wsignin1.0&wtrealm=urn%3afederation%3aMicrosoftOnline&wctx=LoginOptions%3D3%26estsredirect%3d2%26estsrequest%3drQIIAYWQvUvDUADE85o21oIoIqKLVOkgwkveV5KXiKCCghYrKF3EJR8vtmqb2qSKLoKTo7Pg4uiiOIgfi6BTFx1FJ53EydHR-BfIwcFNv7vLZbCKVGtMxiq2C7qgnjA8BImLA8gI1yH3mQtNXQiTJ6LMaPbmenauTrIj1mrxfP9u-LEComMgnYGhShw3IlvTYuHUIrVW9ZphFAax6oU1bS28BuAZgE8AzlIF7AYBFT6HusUwZNxJOJw7UARcOMJlDiXua6p7caoVV8ifhc3qnjiWCyZDjmf6AUSGRyGj3IJJKQ6Fy5OCwg9o4FzKSkKshfUXGXzIg9hEnOLJKG75oh6rznbirUitbz6nwVe6Pwt6pIHOvDTagWQ7m80lScpLP2lwmkmGjl6Pt58u3qcPHorg_OZName02bBUndkqubulLbrbaPjlzQ2mryHSKhrrFbptzZWxVibLS436wgS38ZGitJXUfPStgMMO6bbzn5dec30EEQQxhsTIY2oT3SbGyn2X9As1&cbcxt=&username=170831%40student.aventus.nl&mkt=&lc=`)

        evt.reply(`console`, `Inserting email and password..`)
        await page.waitForSelector(`input[name="UserName"]`)
        await page.evaluate(() => document.querySelector(`input[name="UserName"]`).value = ``)
        await page.type(`input[name="UserName"]`, data.teams.email)
        await page.waitForSelector(`input[id="passwordInput"]`)
        await page.evaluate(() => document.querySelector(`input[id="passwordInput"]`).value = ``)
        await page.type(`input[id="passwordInput"]`, data.teams.pass)

        evt.reply(`console`, `Submitting values..`)
        await page.waitForSelector(`span[id="submitButton"]`)
        await page.click(`span[id="submitButton"]`)

        evt.reply(`console`, `Redirecting to Teams..`)
        await page.waitForSelector(`a[data-tid="early-desktop-promo-use-web"]`)
        await page.click(`a[data-tid="early-desktop-promo-use-web"]`)

        evt.reply(`console`, `Awaiting assignments..`)
        await page.waitForSelector(`div[class="card-content-right"]`)
        await page.waitForSelector(`div[class="list-wrap list-wrap-v3 ts-message-list-container"]`)
        await page.waitForTimeout(2000)
        await page.click(`div[class="list-wrap list-wrap-v3 ts-message-list-container"]`)
        evt.reply(`console`, `Fetching all assignments..`)
        let assignments = [];
        for (i = 0; i < 500; i++) {
            let newItems = await page.evaluate(() => {
                let cards = document.querySelectorAll(`div[class="card-content-right"]`), items = [];
                try {
                    for (i in cards) items.push({
                        name: cards[i].childNodes[4].outerText,
                        due: cards[i].childNodes[14].outerText,
                        append: true
                    })
                } catch (e) {}
                return items;
            })
            for (y in newItems) {
                let skip;
                for (x in assignments) if (assignments[x].name == newItems[y].name || newItems[y].name == ``) skip = true;
                if (!skip) {
                    assignments.push(newItems[y])
                    evt.reply(`console`, `Assignment "${newItems[y].name}" has been added to the buffer.`)
                }
            }
            await page.waitForTimeout(10)
            await page.keyboard.press(`ArrowUp`)
            await page.keyboard.press(`Escape`)
        }

        evt.reply(`console`, `Assignments from Teams collected.`)
        browser.close()


        evt.reply(`console`, `Authenticating with Trello..`)
        let cli = new G.Trello(data.trello.key, data.trello.token)

        evt.reply(`console`, `Fetching all lists on the board..`)
        let lists = await cli.getListsOnBoard(data.trello.board).then(lists => { return lists });
    
        evt.reply(`console`, `Collecting all cards for each list..`)
        let cards = [];
        for (i in lists) {
            let pack = await cli.getCardsOnList(lists[i].id).then(cards => { return cards });
            cards.push(pack)
        }

        evt.reply(`console`, `Dropping duplicates..`)
        for (i in assignments) for (x in cards) for (c in cards[x]) if (assignments[i].name == cards[x][c].name) assignments[i].append = false;
        let pack = [];
        for (i in assignments) if (assignments[i].append) {
            let due = assignments[i].due.replace(`Vervaldatum `, ``).split(` `), months = [`jan`, `feb`, `mar`, `apr`, `may`, `jun`, `jul`, `aug`, `sep`, `oct`, `nov`, `dec`], query = {
                desc: `Toegevoegd met Tealo.`,
                idCardSource: data.trello.template,
                keepFromSource: [`checklists`, `labels`]
            };
            for (x in months) if (months[x] == due[1]) query.due = `2020-${months.indexOf(months[x])+1}-`+due[0];
            assignments[i].query = query;
            pack.push(assignments[i])
        }
        return {pack: pack, data: data};
    } catch (e) {
        evt.reply(`console`, `An error has occoured, posting in 5s.`)
        setTimeout(() => evt.reply(`console`, e), 5000)
    }
}

////////// ELECTRON /////////////////////////////////////

const app = () => {
    G.elec.app.on('ready', () => {
        let app = new G.elec.BrowserWindow({
            width: 850,
            height: 500,
            icon: './html/assets/tealo.png',
            webPreferences: { nodeIntegration: true }
        });
        app.setMenuBarVisibility(true)
        app.setResizable(false)
        app.loadFile('html/index.html')
    
        /////// PARSE ////////////////
        G.elec.ipcMain.on('getTeams', async (evt, data) => {
            evt.reply(`assignments`, await teams(data, evt))
            try {
                let local = data;
                local.teams.pass = G.encryptor.encrypt(local.teams.pass);
                local.trello.key = G.encryptor.encrypt(local.trello.key);
                local.trello.token = G.encryptor.encrypt(local.trello.token);
                G.json.writeFileSync(`data.json`, local)
                evt.reply(`console`, `Data stored and encrypted locally.`)
            } catch (e) {
                evt.reply(`console`, `Could not store data locally.`)
            }
            evt.reply(`unlock`)
        })

        G.elec.ipcMain.on('pushTrello', async (evt, data) => {
            try {
                evt.reply(`console`, `Authenticating with Trello..`)
                let cli = new G.Trello(data.data.trello.key, data.data.trello.token)
                for (i in data.assignments) {
                    await cli.addCardWithExtraParams(data.assignments[i].name, data.assignments[i].query, data.data.trello.task)
                    evt.reply(`console`, `Pushed new card "${data.assignments[i].name}" to Trello.`)
                }
            } catch (e) {
                evt.reply(`console`, `An error has occoured, posting in 5s.`)
                setTimeout(() => evt.reply(`console`, e), 5000)
            }
            evt.reply(`console`, `All assignments have been pushed to Trello!`)
            evt.reply(`unlock`)
        })

        G.elec.ipcMain.on(`getData`, async (evt) => {
            try {
                let local = await G.json.readFileSync(`data.json`);
                local.teams.pass = G.encryptor.decrypt(local.teams.pass);
                local.trello.key = G.encryptor.decrypt(local.trello.key);
                local.trello.token = G.encryptor.decrypt(local.trello.token);
                evt.reply(`data`, local)
                evt.reply(`console`, `Local data has been imported.`)
            } catch (e) {
                evt.reply(`console`, `No local data has been found.`)
            }
        })
    })
}

////////// MASTER ////////////////////////////////////////

const master = async () => {
    app()
}; master()
