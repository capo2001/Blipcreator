--================================================================================================
--==                                                                                            ==
--==                          BLIPS CREATOR - React Version by Jules                            ==
--==                                                                                            ==
--================================================================================================

local Blips = {}

function RefreshBlips()
    local result = MySQL.query.await('SELECT * FROM blips')
    Blips = {}
    if result then
        for i=1, #result, 1 do
            table.insert(Blips, {
                id = result[i].id,
                name = result[i].name,
                color = result[i].color,
                sprite = result[i].sprite,
                x = result[i].x,
                y = result[i].y,
                z = result[i].z,
                size = result[i].size
            })
        end
    end
    -- Send the updated list to all clients to draw on the map and update their UI if open
    TriggerClientEvent('capo-blipcreator:client:sendBlips', -1, Blips)
end

CreateThread(function()
    Wait(2000)
    RefreshBlips()
end)

-- Event to create a new blip, called from client.lua
RegisterNetEvent('capo-blipcreator:server:createBlip', function(data)
    MySQL.insert('INSERT INTO blips (name, color, sprite, size, x, y, z) VALUES (?, ?, ?, ?, ?, ?, ?)', {
        data.name,
        data.color,
        data.sprite,
        data.size,
        data.x,
        data.y,
        data.z
    }, function(id)
        if id then
            RefreshBlips()
        end
    end)
end)

-- Event to update an existing blip
RegisterNetEvent('capo-blipcreator:server:updateBlip', function(data)
    MySQL.update('UPDATE blips SET name = ?, color = ?, sprite = ?, size = ? WHERE id = ?', {
        data.name,
        data.color,
        data.sprite,
        data.size,
        data.id
    }, function(affectedRows)
        if affectedRows > 0 then
            RefreshBlips()
        end
    end)
end)

-- Event to delete a blip, called from client.lua
RegisterNetEvent('capo-blipcreator:server:deleteBlip', function(data)
    MySQL.update('DELETE FROM blips WHERE id = ?', { data.id }, function(affectedRows)
        if affectedRows > 0 then
            RefreshBlips()
        end
    end)
end)

-- Event specifically for the UI to request the current list of blips
RegisterNetEvent('capo-blipcreator:server:getBlipsForUI', function()
    local src = source
    -- Send the currently cached blip list directly to the client that asked for it.
    TriggerClientEvent('capo-blipcreator:client:receiveBlipsForUI', src, Blips)
end)
