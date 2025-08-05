fx_version 'cerulean'
game 'gta5'

-- 💬 Discord: capo_2001

author 'CAPO & Jules'
description 'Blip Creator with React UI'
version '3.0'

ui_page 'web/build/index.html'

files {
    'web/build/index.html',
    'web/build/**/*',
}

shared_scripts {
    '@oxmysql/lib/MySQL.lua',
    'config.lua'
}

server_script 'server.lua'
client_script 'client.lua'