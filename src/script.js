let buildType = '';

// Open dialog to select directory
document.getElementById('browse').addEventListener('click', () => {
    window.postMessage({
        type: 'select-dirs'
    })
})

// Form validation
document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();

    const directoryPath = document.getElementById('directoryPath').value;
    const buildKey = document.getElementById('buildKey').value;
    const verticals = document.querySelectorAll('.btn-check:checked');
    
    if (!directoryPath) {
        return alert('Please select fadvuk theme folder to proceed');
    } else if (!buildKey) {
        return alert('Build key is required to proceed');
    } else if (!document.querySelectorAll('.btn-check:checked').length) {
        return alert('You must select at least 1 vertical');
    } else if (directoryPath.split('\\').slice(-1)[0] !== 'fadvuk'){
        return alert('The directory path is invalid');
    }
    
    localStorage.setItem('directoryPath', directoryPath);
    localStorage.setItem('buildKey', buildKey);
    localStorage.setItem('verticals', Array.from(verticals).map(v => v.getAttribute('name')));

    for (const vertical of verticals) {
        const verticalName = vertical.getAttribute('name');
        let env;
        switch (verticalName) {
            case 'uk': {
                env = {
                    APP_DOMAIN: 'advisor',
                    APP_COUNTRY: 'uk',
                }
                break;
            }
            case 'de': {
                env = {
                    APP_DOMAIN: 'advisor',
                    APP_COUNTRY: 'de',
                }
                break;
            }
            case 'in': {
                env = {
                    APP_DOMAIN: 'advisor',
                    APP_COUNTRY: 'in',
                }
                break;
            }
            case 'health': {
                env = {
                    APP_DOMAIN: 'health',
                    APP_COUNTRY: 'us',
                    APP_VERTICAL: 'advisor_health'
                }
                break;
            }
            case 'home': {
                env = {
                    APP_DOMAIN: 'homeimprovement',
                    APP_COUNTRY: 'us',
                    APP_REST_API_NAMESPACE: 'homeimprovement'
                }
                break;
            }
            case 'betting': {
                env = {
                    APP_DOMAIN: 'betting',
                    APP_COUNTRY: 'us',
                }
                break;
            }
        }

        for (const key of buildKey.split(',')) {
            env = {
                ...env,
                mpPageKey: key,
                APP_ENV: 'local'
            }
            window.postMessage({
                type: 'command',
                command: `npm run ${buildType}`,
                cwd: directoryPath,
                env
            })
        }
    }

    buildType = '';
})

document.querySelectorAll('button[type=submit]').forEach(el => {
    el.addEventListener('click', function () {
        buildType = this.getAttribute('name')
    });
})

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('directoryPath').value = localStorage.getItem('directoryPath');
    document.getElementById('buildKey').value = localStorage.getItem('buildKey');
    localStorage.getItem('verticals').split(',').forEach(v => {
        document.querySelector(`.btn-check[name=${v}]`).checked = true;
    })
})