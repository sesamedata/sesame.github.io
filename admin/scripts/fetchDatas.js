async function APIFetch(repo, type) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/W0lfan/SesameAPI/main/api/building.js');
        const buildingCode = await response.text();

        // Execute the code from building.js using Function constructor
        eval(buildingCode);

        // Fetch data from the database
        const content = FetchDataFromDatabase(repo, type);
        return content;
    } catch (error) {
        console.error('Error in APIFetch:', error);
        throw error;
    }
}

function GetSesameID(button) {
    navigator.clipboard.writeText(button.id);
    button.querySelector('.icon').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
    `;
    setTimeout(() => {
    button.querySelector('.icon').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"></path></svg>
    `;
    }, 1500)
}

async function InitSession(input = null) {
    let types = ['codes', 'communities', 'users', 'mods', 'ships'];
    let queryResults = document.querySelector('.queryResults');
    let queryWhole = document.querySelector('.queryWhole');
    console.log('Initialization')
    try {
        // Ensure that session is defined
        if (session.Access) {
            let delSession = document.getElementById('LeaveSession');

            if (!session.stayActive) {
                delSession.style.display="none";
            }
            delSession.addEventListener('click',function() {
                localStorage.removeItem('SesameSessionStorage');
                window.location.reload();
            })
            async function handleEnterKey() {
                queryWhole.innerHTML = "";
                document.querySelector('.loader').style.display = "flex";
                let SearchQuery;
                if (!input) {
                    SearchQuery =  document.querySelector('.act-bar .search-input input').value;
                } else {
                    SearchQuery = input;
                }
                let datas = [[], [], [], [], []];

                // Create an array of promises for APIFetch
                for (let index = 0; index < types.length; index++) {
                    datas[index] = await APIFetch(types[index], [SearchQuery]);
                }
                //const fetchedData = await Promise.all(fetchPromises);

                // Now, you can proceed to LoadDatas with fetchedData
                await LoadDatas(datas);
            }

            async function LoadDatas(datas) {
                document.querySelector('.loader').style.display = "none";
                for (let i = 0; i < 5; i++) {
                    el = datas[i];
                    if (el.length > 0) {
                        let isle;
                        if (!document.getElementById(`${types[i]}-isle`)) {
                            isle = document.createElement('div');
                            isle.classList.add('resultIsle');
                            isle.id = `${types[i]}-isle`;
                            let IsleHeader = document.createElement('div');
                            IsleHeader.classList.add('isleHeader');
                            IsleHeader.innerHTML = types[i].toUpperCase();
                            isle.appendChild(IsleHeader);
                            queryWhole.appendChild(isle);
                        } else {
                            isle = document.getElementById(`${types[i]}-isle`)
                        }
                        el.forEach((data) => {
                            let Data = document.createElement('div');
                            Data.classList.add('dataResult');

                            let dataInfo = document.createElement('div');
                            dataInfo.classList.add('dataInfo');
                            let firstNames;
                            let firstNamesString;
                            if (data.author) {
                                firstNames = data.author.map(author => author.name);
                                firstNamesString = firstNames.join(', ');
                            } else {
                                firstNamesString = '';
                            }

                            let description = data.description;
                            let readMore = false;
                            if (data.description.length > 75) {
                                readMore = true;
                                description = description.slice(0, 72 - 3) + '...';
                            }


                            dataInfo.innerHTML = `
                                <div class="main-header">
                                    ${
                                        data.templateImage ?
                                            `
                                        <div class="main-img">
                                            <img src="${types[i] === "ships" ? data.templateImage.replace(/\.png\/.*/, '.png') : data.templateImage}">
                                        </div>
                                        ` : ''
                                    }
                                    <div class="main-infos">
                                        <div class="name">
                                            ${data.name}
                                        </div>
                                        <div class="author">
                                            ${firstNamesString}
                                        </div>
                                    </div>

                                </div>
                                <div class="description">
                                    ${description}
                                    ${readMore == true ? `
                                        <span id="readMore">
                                            Edit to read more
                                        </span>
                                    ` : ''}
                                </div>
                                <div class="sesame-infos" id="${data.sesameID}" onclick="GetSesameID(this)">
                                    <div class="id">
                                    ${data.sesameID}
                                    </div>
                                    <div class="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                                    </div>
                                </div>
                            `;

                            let content = document.createElement('div');
                            content.classList.add('actionContent');

                            let Edit = document.createElement('div');
                            Edit.classList.add('actionItem');
                            Edit.innerHTML = `
                                <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M772-603 602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z"/></svg>
                                </div>
                            `;

                            Edit.addEventListener('click', async function () {
                                console.log('Click edit')
                                await GetData(`${data.sesameID}`, types[i], "push", i,this);
                            });
                            content.appendChild(Edit);

                            let Delete = document.createElement('div');
                            Delete.classList.add('actionItem');
                            Delete.innerHTML = `
                                <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
                                </div>
                            `;
                            for (let i = 0; i < session.waitingDatas.delete.values.length; i++) {
                                let element = session.waitingDatas.delete.values[i];
                                if (element.sesameID == data.sesameID) {
                                    Delete.classList.add('disabled_button')
                                }
                            }
                            Delete.addEventListener('click', async function () {
                                if (!this.classList.contains('disabled_button')) {
                                    await GetData(`${data.sesameID}`, types[i], "delete", this);

                                }
                            });
                            content.appendChild(Delete);

                            dataInfo.querySelector('.main-header').appendChild(content);

                            Data.appendChild(dataInfo);

                            isle.appendChild(Data);
                        });
                    }

                }

                queryResults.appendChild(queryWhole);
            }

            window.onkeydown = function (event) {
                if (event.key.toLowerCase() === "enter") {
                    handleEnterKey();
                }
            };
        }
    } catch (error) {
        console.error('Error in InitSession:', error);
    }
}

