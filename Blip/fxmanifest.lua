fx_version 'cerulean'
game 'gta5'

-- 💬 Discord: capo_2001

author 'CAPO'
description 'Blip Creator Free For QBCore and ESX'
version '2.0'

ui_page 'web/index.html'

files {
    'web/index.html',
    'web/css/style.css',
    'web/js/script.js'
}

shared_scripts {
    '@oxmysql/lib/MySQL.lua',
    'config.lua'
}

server_script 'server.lua'
client_script 'client.lua'