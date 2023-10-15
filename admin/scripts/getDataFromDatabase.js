function fetchData(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

async function GetData(id, directory, action, item, button) {
    const __Path__ = "https://raw.githubusercontent.com/W0lfan/sesame/main/database/";

    let path = __Path__ + directory + ".json";

    // Create a Promise to handle the asynchronous operation
    const dataPromise = await fetchData(path);
    console.log(dataPromise)
    async function HandleAction() {
        let links = {
            "codes": "code",
            "users": "user",
            "mods": "mod",
            "communities": "community",
            "ships": "ship"
        };
        for (let element of dataPromise) {

            if (element.sesameID === id) {
                if (action === "delete") {
                    session.waitingDatas.delete.values.push(element);
                    localStorage.setItem('SesameSessionStorage', JSON.stringify(session));
                    item.classList.add('disabled_button');
                } else if (action === "push") {
                    DatasPannel("triggerEdit", {id: links[directory],content: element});

                }
                break;
            }
        }
    }

    await HandleAction();


}
