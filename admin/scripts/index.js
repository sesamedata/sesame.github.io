let session;

function LoadFromSource(source, to, callback) {
    fetch(source)
        .then(response => response.text())
        .then(html => {
            to.innerHTML += html;

            // Use a setTimeout to wait for the DOM to be updated
            setTimeout(() => {
                if (callback && typeof callback === 'function') {
                    callback();
                    
                }
            }, 0);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            console.log('Successful load')
        })
}


window.addEventListener('DOMContentLoaded', async function () {
    let LogInButton = document.getElementById('LogInSesame');
    let checkLogIn = document.querySelector('#keepLogIn .toggle');
    if (!localStorage.getItem('SesameSessionStorage')) {
        localStorage.setItem('SesameSessionStorage',JSON.stringify(
            {
                stayActive : false,
                waitingDatas : {
                    "push" : {
                        about : 'The newly added and edited content appear here.',
                        values : []
                    },
                    "delete" : {
                        about : 'The deleted content from the database appears here.',
                        values : []
                    }
                },
                userName : '',
                userToken : ''
            }
        ))
    }
    session = JSON.parse(localStorage.getItem('SesameSessionStorage'));
    session.Access = false;


    document.querySelector('#keepLogIn').addEventListener('click', function () {
        if (checkLogIn.classList.contains('checkOn')) {
            checkLogIn.classList.remove('checkOn');
            session.stayActive = false;
        } else {
            checkLogIn.classList.add('checkOn');
            session.stayActive = true;
        }
        localStorage.setItem('SesameSessionStorage',JSON.stringify(session));
    });
    LogInButton.addEventListener('click', function () {
        LogInSesame();
    });
    if (session.stayActive) {
        checkLogIn.classList.add('checkOn');
        document.getElementById('Token').value = session.userToken;
        document.getElementById('UserName').value = session.userName;
        LogInButton.click();
    }

    async function LogInSesame() {
        const accessToken = document.getElementById('Token').value;
        const username = document.getElementById('UserName').value;
        const apiUrl = `https://api.github.com/repos/W0lfan/SesameAPI/collaborators/${username}/permission`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `token ${accessToken}`,
                },
            });
            if (response.status === 200) {
                const permissionLevel = response.data.permission;
                if (permissionLevel === "write" || permissionLevel === "admin") {
                    session.Access  = true;
                    if (session.stayActive) {
                        session.userName = document.getElementById('UserName').value;
                        session.userToken = document.getElementById('Token').value;
                        localStorage.setItem('SesameSessionStorage',JSON.stringify(session));
                        document.getElementById('Token').value = '';
                    }
                    document.body.innerHTML="";
                    LoadFromSource('main.txt', document.body,async function() {
                        await InitSession(null)
                    });
                }
            } else {
                console.error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };


});
