



function GoBack() {
    document.querySelector('.backscreen').style.display="none";
    DatasPannel();
}


let RenderDatas = {};
function CreateRender() {
    RenderDatas = {};
    let pannel = document.querySelector('.pannel');
    pannel.innerHTML = "";

    function createDataInfo(data,i) {
        const firstNamesString = data.author ? data.author.map(author => author.name).join(', ') : '';

        return `
            <div class="main-header">
                <div class="main">
                    <div class="main-img">
                            <img src="${data.templateImage ? data.templateImage.replace(/\.png\/.*/, '.png') : 'https://github.com/W0lfan/W0lfan.github.io/blob/main/sesame/webutils/img/logo.png?raw=true'}">
                            <div class="icon-info">
                                ${i === "push" ? `
                                    <svg id="push" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-160H260q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520v-286l64 62 56-56-160-160-160 160 56 56 64-62v286Z"/></svg>
                                `  : `
                                    <svg id="delete" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200h80v80Zm-80-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160q0-33 23.5-56.5T200-840v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 0v-80h80v80h-80Zm60 640-56-56 142-142-142-142 56-56 142 142 142-142 56 56-142 142 142 142-56 56-142-142-142 142Zm100-640v-80h80v80h-80Zm160 160v-80h80v80h-80Zm160 0v-80q33 0 56.5 23.5T840-760h-80Z"/></svg>
                                `
                                }
                            </div>
                        </div>
                    <div class="main-infos">
                        <div class="name">
                            ${data.name}
                        </div>
                        <div class="author">
                            ${firstNamesString}
                        </div>
                    </div>
                </div>
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
    }



    const divContainer = document.createElement('div');
    divContainer.classList.add('divContainer');
    pannel.innerHTML = `
        <div class="topBack" onclick="GoBack()">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            <span>Back</span>
        </div>
    `;
    function createPublishButton() {
        // Create the container element.
        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions-container');
      
        // Create the publish button element.
        const publishButton = document.createElement('div');
        publishButton.classList.add('button');
        publishButton.id = 'publish';
      
        // Create the message element.
        const message = document.createElement('div');
        message.classList.add('message');
      
        // Create the info element.
        const info = document.createElement('div');
        info.classList.add('info');

        info.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-160H260q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520v-286l64 62 56-56-160-160-160 160 56 56 64-62v286Z"/></svg>
        `;
    
      
        message.appendChild(info);
        const span = document.createElement('span');
        span.textContent = 'Publish to the database';
        message.appendChild(span);
        publishButton.appendChild(message);
        actionsContainer.appendChild(publishButton);
        publishButton.addEventListener('click', function() {
          PushToGithub();
        });
      
        // Return the container element.
        return actionsContainer;
      }
      
      // Append the publish button container to the DOM.
     divContainer.appendChild(createPublishButton());
      

    Object.keys(session.waitingDatas).forEach((i) => {
        try {
            session.waitingDatas[i].values.forEach((data) => {
                RenderDatas[data.sesameID] = data;
                let dataInfo = document.createElement('div');
                dataInfo.classList.add('dataResult');
                dataInfo.innerHTML = createDataInfo(data, i);
        
                let content = document.createElement('div');
                content.classList.add('actionContent');

                let editButton = document.createElement('div');
                editButton.classList.add('actionItem');
                editButton.id = data.sesameID + "_edit";
                editButton.innerHTML = `
                  <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M772-603 602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z"/></svg>
                  </div>
                  <span>Edit</span>
                `;
                editButton.addEventListener('click',function() {
                    let split = data.sesameID.split('-')
                    console.log(split)
                    console.log(tree.reverseAbreviation[split[0]])
                    DatasPannel("triggerEdit", {id: tree.reverseAbreviation[data.sesameID.split('-')[0]],content: data});
                });
                if (i==="delete") {
                    editButton.classList.add('disabled_button');
                }
                content.appendChild(editButton);

    
                
                let del = document.createElement('div');
                del.classList.add('actionItem');
                del.id = data.sesameID + "_del";
                del.innerHTML = `
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
                        <span>Remove</span>
                    </div>
                `;
                content.appendChild(del);
                dataInfo.querySelector('.main-header').appendChild(content);
                divContainer.appendChild(dataInfo);
                del.addEventListener('click',function() {
                    Object.keys(session.waitingDatas).forEach((i) => {
                        if (session.waitingDatas[i].values.includes(data)) {
                            session.waitingDatas[i].values.splice(session.waitingDatas[i].values.indexOf(data), 1);
                            localStorage.setItem('SesameSessionStorage', JSON.stringify(session));
                            CreateRender();
                            return;
                        }
                    });
                });
            });
        } catch (error) {
            console.log(error)
        }

    })





    let PublishContainer = document.createElement('div');
    PublishContainer.classList.add('publish-container');

    PublishContainer.appendChild(divContainer);
    pannel.appendChild(PublishContainer);
}




function DatasPannel(action=null,metadata=null) {
    let backscreen = document.querySelector('.backscreen');
    backscreen.innerHTML="";
    document.querySelector('.backscreen').style.display="flex";
    console.log('Test 1: Success')
        LoadFromSource('pannel.txt',backscreen, () =>  {
            let OpenPushContent = document.getElementById('InfoUpdate');
            let Pannel = document.querySelector('.pannel');
            let AddDatas = document.getElementById('addData');

            document.querySelector('.closePannel').addEventListener('click',function() {
                document.querySelector('.backscreen').style.display="none";
            })

            AddDatas.addEventListener('click',function() {
                Pannel.innerHTML = '';
                LoadForms();
            });
            const currentDatas = session.waitingDatas.push.values.length + session.waitingDatas.delete.values.length;
            if (action === "triggerEdit") {
                AddDatas.click()
            }

            function LoadForms() {
                LoadFromSource('addItems/main.txt', Pannel, () => {
                    let Items = document.querySelectorAll('.classes .item');
                    let Form = document.querySelector('.contentForm');
                        Items.forEach((button) => {
                            button.addEventListener('click',function(event) {
                                const customData = Boolean(event.target.getAttribute('load-item-in'));

                                Form.innerHTML = '';
                                let Pattern = JSON.parse(patterns[button.id]);
                                let Item = document.querySelectorAll('.itemSelected');
                    
                                Item.forEach((i) => {
                                    i.classList.remove('itemSelected');
                                })
                                this.classList.add('itemSelected');
                    
                                function generateFormFields(data, parentKey = "") {
                                    for (const key in data) {
                                        if (typeof data[key] === "object" && !Array.isArray(data[key])) {
                                            generateFormFields(data[key], parentKey + key + ".");
                                        } else if (Array.isArray(data[key]) && data[key].length > 0 && typeof data[key][0] === "object") {
                                            for (let i = 0; i < data[key].length; i++) {
                                                generateFormFields(data[key][i], key + '.' + data[key][i].id);
                                            }
                                        } else {
                                            if (!key.includes('src')) {
                                                const div = document.createElement('div');
                                                div.classList.add('contentInput');
                                                if (!document.querySelector('.contentForm .contentLinks') && parentKey.includes("links")) {
                                                    const div = document.createElement('div');
                                                    div.classList.add('contentLinks');
                                                    document.querySelector('.contentForm').appendChild(div);
                                                } else if (!document.querySelector('.contentForm .contentAbout') && parentKey.includes("about")) {
                                                    const div = document.createElement('div');
                                                    div.classList.add('contentAbout');
                                                    document.querySelector('.contentForm').appendChild(div);
                                                }
                                                const label = document.createElement("div");
                                                label.classList.add('title');
                                                const labelText = capitalizeFirstLetter(parentKey) + key.replace('id','');
                                                label.innerHTML = labelText.replace(/\./g, '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>');
                                                const input = document.createElement("input");
                                                input.setAttribute("type", "text");
                                                input.setAttribute("name", capitalizeFirstLetter(parentKey) + key.replace('id',''));
                                                function FillDatas() {
                                                        if (parentKey.includes('.')) {
                                                            let spliced = parentKey.split('.');
                                                            if (spliced[1] != '') {
                                                                let foundObject = metadata.content[spliced[0]].find(obj => obj.id === spliced[1]);
                                                                if (foundObject) {
                                                                    input.value = foundObject.src;
                                                                }
                                                            } else {
                                                                if (typeof metadata.content[`${spliced[0]}`] === 'object') {
                                                                    input.value = metadata.content[spliced[0]][`${key}`];

                                                                } else {
                                                                    input.value = metadata.content[`${spliced[0]}`][`${key}`];
                                                                }
                                                            }
                                                            return;
                                                        }
                                                        let formattedParentKey = parentKey;
                                                        let formattedKey = key.replace('id', '');
                                                        if (parentKey === '' && metadata.content[formattedKey]) {
                                                            if (formattedKey == "author") {
                                                                input.value = metadata.content[formattedKey].map(obj => obj.name).join(', ')
                                                            } else {
                                                                input.value = metadata.content[formattedKey];
                                                            }
                                                        } else  if (parentKey != '' && metadata.content[formattedParentKey]) {
                                                            input.value = metadata.content[formattedParentKey][formattedKey];
                                                        } 
                                                }
                                                if (customData) {
                                                    FillDatas()
                                                }
                                                input.placeholder = placeholder[`${capitalizeFirstLetter(parentKey) + key.replace('id','')}`] ? placeholder[`${capitalizeFirstLetter(parentKey) + key.replace('id','')}`] : '';
                                                input.required = true;
                                                if (key.toLocaleLowerCase().includes('sesameid')) {
                                                    input.readOnly = true;
                                                    if (input.value === '') {
                                                        let id = DataKey({name:"XXX"},button.id);
                                                        input.value = id.sesameID;
                                                    }
                                                }
                                                input.classList.add('InputEnter')
                                                div.appendChild(input);
                                                div.appendChild(label);
        
                                                if (parentKey.includes("links")) {
                                                    document.querySelector('.contentForm .contentLinks').appendChild(div);
                                                } else if (parentKey.includes("about")) {
                                                    document.querySelector('.contentForm .contentAbout').appendChild(div);
                                                } else {
                                                    Form.appendChild(div);
                                                }
                                            } 
                                        }
                                    }
                                }
                                generateFormFields(Pattern);
                    

                                if (!document.querySelector('.actions-container .action')) {
                                    let ActionsContainer = document.querySelector('.actions-container');
                                    let Action = document.createElement('div');
                                    Action.classList.add('action');
                                    Action.innerHTML = `
                                    <div class="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm328-240-65 65 56 56 161-161-161-161-56 56 65 65H320v80h168Z"/></svg>
                                    </div>
                                    <div class="name">
                                        Transfer
                                    </div>`;
                                    Action.addEventListener('click',function() {
                                        ValidateContent(`${button.id}`)
                                    });
                                ActionsContainer.appendChild(Action);
                                }

                            });
                            if (action === "triggerEdit") {
                                if (button.id === metadata.id) {
                                    button.setAttribute('load-item-in', true);
                                    button.click();
                                }
                            }
                        });
                });
            }

            if (currentDatas <= 0) {
                OpenPushContent.remove();
            } else {
                OpenPushContent.querySelector('.message span').innerHTML = `Start the database push for ${currentDatas} data${currentDatas>1?'s':''}`;
                OpenPushContent.addEventListener('click',() => {
                    CreateRender();
                });
            }



        });

}



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function ReturnShipCode(code) {
        code = code.replace(/[;]*$/, '');
        code = code.replace(/[']*$/, '');
        code = code.replace(/'/, '');
        var firstEqualsIndex = code.indexOf('=');

        if (firstEqualsIndex !== -1) {
          // Extract the portion of the string after the '=' sign
          code = code.substring(firstEqualsIndex + 1);
        }
        let parsed = JSON.parse(code);
        return [parsed];
}

function ValidateContent(id,action='push') {
    let inputs = document.querySelector('.pannel').querySelectorAll('input');
    let js_content = {};
    inputs.forEach((el) => {
        let label = el.name;
        let parts = label.split('.');
        if (parts[0] === ("author")) {
            author = el.value.split(',');
            if (!js_content["author"]) js_content["author"] = [];
            author.forEach((a) => {
                js_content["author"].push({
                    name :  a
                })
            });
        } else if (parts[0] === "content") {

        }
        else {
            parts[0] = parts[0].charAt(0).toLowerCase() + parts[0].slice(1);
            value = el.value;
            if (value == "true" || value == "false") {
                value = Boolean(el.value);
            }
            if (parts.length <= 1) {
                js_content[parts[0]] = value;
            } else {
                if (parts[0] === "links") {
                    if (!js_content["links"]) js_content["links"]  = [];
                    js_content["links"].push({
                        id : parts[1],
                        src : value
                    });
                } else {
                    if (!js_content["about"]) js_content["about"] = {}
                    js_content["about"][`${parts[1]}`] = value;
                }
            }
        }
    });
    if (id == "ship" && js_content.code) {
        js_content.code = ReturnShipCode(js_content.code);
    } 
    console.log(js_content, "isContent")
    if (!js_content.sesameID) {
        js_content = DataKey(js_content,id);
    } 

    try {
        Object.keys(session.waitingDatas).forEach((j) => {
            for (let i = 0 ; i < session.waitingDatas[j].values.length; i++) {
                let element = session.waitingDatas[action].values[i];
                if (element.sesameID === js_content.sesameID) {
                    session.waitingDatas[j].values.splice(i,1);
                }
            }
        })
        session.waitingDatas[action].values.push(js_content);
        localStorage.setItem('SesameSessionStorage',JSON.stringify(session));
        document.querySelector('.addItemsContainer .header').remove();
        document.querySelector('.addItemsContainer .contentForm').remove();
        document.querySelector('.addItemsContainer .actions-container').remove();

        LoadFromSource('addItems/done.txt',document.querySelector('.addItemsContainer'))
    } catch (error) {
        console.log(error)
    }

};

function DataKey(data, link) {
    /**
     * A Sesame key should act as the following:
     * - path: md, usr, cd, cmt, sp
     * - current place in the database
     */
  


    function generateAbbreviation(inputString) {
      const words = inputString.split(' ');
      let abbreviation = '';
  
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        abbreviation = abbreviation + '-' + word[0] + word[Math.floor(word.length / 2)] + word[word.length - 1];

      }
  
      return abbreviation;
    }
    function generateKey(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGGHIGKLMNOPQRSTUVWXYZ1234567890";
        let key = '';
        for (i = 0; i < length; i++) {
            key+=charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return key;
    }
  
    // Generate an abbreviation from the 'name' property of 'data'
    const abbreviation = generateAbbreviation(data.name.replace(/[^a-zA-Z0-9]/g,''));
  

    data.sesameID = `${tree.abbreviation[link]}${abbreviation}-${generateKey(10)}`;

    return data;
  }