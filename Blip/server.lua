--================================================================================================
--==                                                                                            ==
--==                                   BLIPS CREATOR                                            ==
--==                                                                                            ==
--================================================================================================


--================================================================================================
--==                                                                                            ==
--==                                   [ OX MYSQL ]                                             ==
--==                                                                                            ==
--================================================================================================

local Blips = {}

function RefreshBlips()
    local result = MySQL.query.await('SELECT * FROM blips')
    Blips = {}
    if result then
        for i=1, #result, 1 do
            table.insert(Blips, {
                name = result[i].name,
                color = result[i].color,
                sprite = result[i].sprite,
                x = result[i].x,
                y = result[i].y,
                z = result[i].z
            })
        end
    end
    TriggerClientEvent('capo-blipcreator:client:sendBlips', -1, Blips)
end

CreateThread(function()
    Wait(2000)
    RefreshBlips()
end)


RegisterNetEvent('capo-blipcreator:server:createBlip', function(data)
    local src = source
    MySQL.insert('INSERT INTO blips (name, color, sprite, x, y, z) VALUES (?, ?, ?, ?, ?, ?)', {
        data.name,
        data.color,
        data.sprite,
        data.x,
        data.y,
        data.z
    }, function(id)
        if id then
            RefreshBlips()
        end
    end)
end)

RegisterNetEvent('capo-blipcreator:server:deleteBlip', function(data)
    local src = source
    MySQL.update('DELETE FROM blips WHERE name = ?', { data.name })
    RefreshBlips()
end)

RegisterNetEvent('capo-blipcreator:server:getBlips', function()
    local src = source
    TriggerClientEvent('capo-blipcreator:client:sendBlips', src, Blips)
end)
