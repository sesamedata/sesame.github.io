function PushToGithub() {
    let PublishContainer = document.querySelector('.publish-container');
    PublishContainer.innerHTML = '';
    PublishContainer.appendChild(GenerateInput());
}



function GenerateInput() {
        const pushForm = document.createElement('div');
        pushForm.className = 'PushForm';

        const header = document.createElement('div');
        header.className = 'PushHeader';

        const innerHeader = document.createElement('div');
        innerHeader.className = 'title';

        const img = document.createElement('img');
        img.src = 'styles/webutils/sesamod.png';

        innerHeader.appendChild(img);

        const infoSheet = document.createElement('div');
        infoSheet.className = 'infoSheet';

        // Create the top div inside infoSheet
        const top = document.createElement('div');
        top.className = 'top';
        top.textContent = `You (${session.userName}) are about to initialize a push`;

        // Create the bottom div inside infoSheet
        const bottom = document.createElement('div');
        bottom.className = 'bottom';
        bottom.textContent = `${session.waitingDatas.push.values.length} push and ${session.waitingDatas.delete.values.length} deletion (${session.waitingDatas.push.values.length + session.waitingDatas.delete.values.length} change ${session.waitingDatas.push.values.length + session.waitingDatas.delete.values.length>1?'s':''} in total)`;

        // Append the top and bottom to infoSheet
        infoSheet.appendChild(top);
        infoSheet.appendChild(bottom);

        // Create the input div
        const input = document.createElement('div');
        input.className = 'input';

        // Create the name div inside input
        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = 'Enter your personal Github token';

        // Create the input element
        const tokenInput = document.createElement('input');
        tokenInput.id = "tokenInput";
        tokenInput.setAttribute('type', 'password');

        // Append the name and input to the input div
        input.appendChild(name);
        input.appendChild(tokenInput);

        // Create the launch div
        const launch = document.createElement('div');
        launch.className = 'launch';
        launch.innerHTML = `
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z"/></svg>
        </div>
        <div class="text">
            Initiate
        </div>
        `;

        launch.addEventListener('click',async function() {
            await CheckAvailability();
        });

        pushForm.appendChild(header);
        header.appendChild(innerHeader);
        header.appendChild(infoSheet);
        pushForm.appendChild(input);
        pushForm.appendChild(launch);

        return pushForm;
};



function GenerateStatus(params) {
    let PublishContainer = document.querySelector('.publish-container');
    PublishContainer.innerHTML = `
        <div class="statusInfos" style="border:${params.color};fill:${params.color}" >
            <div class="item">${params.icon}</div>
            <div class="text">${params.value}</div>
        </div>
    `;
}


async function CheckAvailability() {
        const token = document.querySelector('#tokenInput').value;
        const apiUrl = `https://api.github.com/repos/W0lfan/SesameAPI/collaborators/${session.userName}/permission`;
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `token ${document.querySelector('#tokenInput').value}`,
                },
            });
            if (response.status === 200) {
                const permissionLevel = response.data.permission;
                console.log(permissionLevel)
                if (permissionLevel === "write" || permissionLevel === "admin") {
                    console.log('Admin!')
                    GenerateStatus({
                        color : '#35AB36',
                        icon : '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
                        value : "Valid token. Push initialized."
                    });
                    async function InitDatasRendering() {
                        const directories = Object.values(tree.links);
                        let datas = {};
                        // Create an array to store all the Promises for content loading
                        const contentPromises = [];
                      
                        for (let i = 0; i < directories.length; i++) {
                          const link = directories[i];
                          const path = tree.main + tree.files.database + link + ".json";
                          let ch = false;
                          const contentPromise = new Promise(async (resolve, reject) => {
                            try {
                              let content = await fetchData(path);
                              console.log(content, "content");
                              GenerateStatus({
                                color: '#35AB36',
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q23-81 85.5-136T440-797v323l-64-62-56 56 160 160 160-160-56-56-64 62v-323q103 14 171.5 92.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Z"/></svg>',
                                value: `Loading content of ${directories[i]}.json`
                              });
                              let DatasToPush = session.waitingDatas;
                      
                              for (let i of Object.keys(DatasToPush)) {
                                let ctn = DatasToPush[i].values;
                                if (i === "delete") {
                                  for (let element of ctn) {
                                    for (let index = 0; index < content.length; index++) {
                                      let dataBaseElement = content[index];
                                      if (element.sesameID && dataBaseElement.sesameID && element.sesameID.toLowerCase() === dataBaseElement.sesameID.toLowerCase()) {
                                        GenerateStatus({
                                          color: '#35AB36',
                                          icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>',
                                          value: `Removing ${dataBaseElement.sesameID} (${dataBaseElement.name}) from the database`
                                        });
                                        content.splice(index, 1);
                                        ch=true;
                                        break;
                                      }
                                    }
                                  }
                                } else if (i === "push") {
                                  for (let element of ctn) {
                                    let pushed = false;
                                    for (let index = 0; index < content.length; index++) {
                                      let dataBaseElement = content[index];
                                      if (element.sesameID && dataBaseElement.sesameID && element.sesameID.toLowerCase() === dataBaseElement.sesameID.toLowerCase()) {
                                        GenerateStatus({
                                          color: '#35AB36',
                                          icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160v-80h110l-16-14q-49-49-71.5-106.5T160-478q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"/></svg>',
                                          value: `Exchanging ${dataBaseElement.sesameID} (${dataBaseElement.name})`
                                        });
                                        content[index] = element;
                                        ch=true;
                                        pushed = true;
                                        break;
                                      }
                                    }
                                    if (!pushed) {
                                      let id = element.sesameID.split('-');
                                      if (directories[i] === tree.reverseAbreviation[id[0]]) {
                                        content.push(element);
                                        ch=true;
                                      }
                                    }
                                  }
                                }
                              }
                              datas[directories[i]] = {
                                values : content,
                                change : ch
                              };
                              resolve();
                            } catch (error) {
                              reject(error);
                            }
                          });
                      
                          contentPromises.push(contentPromise);
                        }
                      
                        // Wait for all contentPromises to complete
                        await Promise.all(contentPromises);
                      
                        await PrintDatas(datas);
                      }
                      
                      async function PrintDatas(datas) {
                        console.log(datas, "datas");
                        for (rep in datas) {
                            repo = datas[rep];
                            if (repo.change === true) {
                                console.log(repo)
                                await EditGithub();
                                async function EditGithub() {
                                    const path = `https://api.github.com/repos/W0lfan/${tree.repo}/contents/database/${rep}.json`;
                                    GenerateStatus({
                                        color: '#35AB36',
                                        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-160H260q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520v-286l64 62 56-56-160-160-160 160 56 56 64-62v286Z"/></svg>',
                                        value: `Pushing to database/${rep}.json`
                                      });
                                    const updated = JSON.stringify(repo.values,null,2);
                                    const utf8Bytes = new TextEncoder().encode(updated);
                                    const base64String = btoa(String.fromCharCode(...utf8Bytes));
                                    async function getSHA() { 
                                        try {
                                          const response = await axios.get(path);
                                          return response.data.sha;
                                        } catch (error) {
                                            GenerateStatus({
                                                color : '#B82828',
                                                icon : '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
                                                value : "An error occured. This may be related to the limitation rate."
                                            });
                                          throw error; // Rethrow the error for higher-level handling
                                        }
                                      }
                                    const sha = await getSHA();
                                    try {
                                        await axios.put(path, {
                                            message : `LiveUpdate from SesAdmin by ${session.userName} to database/${rep}.json`,
                                            content : base64String,
                                            sha : sha
                                        }, {
                                            headers : {
                                                Authorization : `Bearer ${token}`
                                            }
                                        });
                                    } catch(error) {
                                        console.log("Error in the update");
                                        GenerateStatus({
                                            color : '#B82828',
                                            icon : '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
                                            value : "An error occured. This may be related to the limitation rate."
                                        });
                                        throw error;
                                    } finally {
                                        Object.keys(session.waitingDatas).forEach((e) => {
                                            e.values = [];
                                          });
                                          localStorage.setItem('SesameSessionStorage',JSON.stringify(session));
                                        GenerateStatus({
                                            color: '#35AB36',
                                            icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m80-80 200-560 360 360L80-80Zm502-378-42-42 224-224q32-32 77-32t77 32l24 24-42 42-24-24q-14-14-35-14t-35 14L582-458ZM422-618l-42-42 24-24q14-14 14-34t-14-34l-26-26 42-42 26 26q32 32 32 76t-32 76l-24 24Zm80 80-42-42 144-144q14-14 14-35t-14-35l-64-64 42-42 64 64q32 32 32 77t-32 77L502-538Zm160 160-42-42 64-64q32-32 77-32t77 32l64 64-42 42-64-64q-14-14-35-14t-35 14l-64 64Z"/></svg>',
                                            value: `All good! All your content has been pushed to the database.`
                                          });
                                    }
                                }
                                
                            }
                        }
                      }
                      
                      async function run() {
                        await InitDatasRendering();
                        // The `datas` object is now available here
                      }
                      
                      run();
                      
                } else {
                    GenerateStatus({
                        color : '#B82828',
                        icon : '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
                        value : "Token rejected"
                    });
                }
            } else {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                GenerateStatus({
                    color : '#B82828',
                    icon : '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
                    value : "Token rejected"
                });
            }
        } catch (error) {
            console.error('Error:', error.message);
            GenerateStatus({
                color : '#B82828',
                icon : '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
                value : "Token rejected"
            });
        }
}