document.addEventListener('DOMContentLoad', () => {
    const csvInput = document.getElementById('csv-input')
    const jsonOutput = document.getElementById('json-output')
    const convertToJsonBtn = document.getElementById('convert-to-json')
    const convertToCsvBtn = document.getElementById('convert-to-csv')
    const clearBtn = document.getElementById('clear')
    const filePathInput = document.getElementById('file-path')
    const openCsvBtn = document.getElementById('open-csv')
    const saveCsvBtn = document.getElementById('save-csv')
    const openJsonBtn = document.getElementById('open-json')
    const saveJsonBtn = document.getElementById('save-json')
    const warning = document.getElementById('warning')

    function showWarning(message) {
        warning.textContent = message
    }

    function clearWarning() {
        warning.textContent = ''
    }

    function csvToJson(csv) {
        const lines = csv.trim().split('\n')
        const headers = lines[0].split(',')
        const result = lines.slice(1).map(line => {
            const values = line.split(',')
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index]
                return obj
            }, {})
        })
        return JSON.stringify(result, null, 2)
    }

    convertToJsonBtn.addEventListener('click', () => {
        clearWarning()
        const csv = csvInput.values
        if (!csv) {
            showWarning('CSV input is empty')
            return
        }
        try {
            const json = csvToJson(csv)
            jsonOutput.value = json
        } catch (e) {
            showWarning('Invalid CSV format')
        }
    })

    convertToCsvBtn.addEventListener('click', () => {
        clearWarning()
        const json = jsonOutput.value
        if (!json) {
            showWarning('Invalid JSON format')
        }
    })

    clearBtn.addEventListener('click', () => {
        csvInput.value = ''
        jsonOutput.value = ''
        clearWarning()
    })

    function readFile(filePath) {
        return fetch(filePath).then(response => {
            if (!response.ok) throw new Error('File not found')
            return response.text()
        })
    }

    openCsvBtn.addEventListener('click', () => {
        const filePath = filePathInput.value
        if (!filePath) {
            showWarning('File path is empty')
            return
        }
        readFile(filePath)
            .then(data => {
                csvInput.value = data
                clearWarning()
            })
            .catch(error => {
                showWarning(error.message)
            })
    })

    saveCsvBtn.addEventListener('click', () => {
        const filePath = filePathInput.value
        const csv = csvInput.value
        if (!filePath || !csv) {
            showWarning('File path or CSV content is empty')
            return
        }
        const blob = new Blob([csv], { type: 'text/csv' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.click()
        clearWarning()
    })

    openJsonBtn.addEventListener('click', () => {
        const filePath = filePathInput.value
        if (!filePath) {
            showWarning('File path is empty')
            return
        }
        readFile(filePath)
            .then(data => {
                jsonOutput.value = data
                clearWarning()
            })
            .catch(error => {
                showWarning(error.message)
            })
    })

    saveJsonBtn.addEventListener('click', () => {
        const filePath = filePathInput.value
        const json = jsonOutput.value
        if (!filePath || !json) {
            showWarning('File path or JSON content is empty')
            return
        }
        const blob = new Blob([json], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filePath
        link.click()
        clearWarning()
    })
})