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
                -- Use a default size of 1.0 if the column doesn't exist
                size = result[i].size or 1.0
            })
        end
    end
    TriggerClientEvent('capo-blipcreator:client:sendBlips', -1, Blips)
end

CreateThread(function()
    Wait(2000)
    RefreshBlips()
end)

-- Event to create a new blip, called from client.lua
RegisterNetEvent('capo-blipcreator:server:createBlip', function(data)
    -- Check if size is provided and build query accordingly for backwards compatibility
    local query = "INSERT INTO blips (name, color, sprite, x, y, z"
    local params = {data.name, data.color, data.sprite, data.x, data.y, data.z}

    if data.size then
        query = query .. ", size) VALUES (?, ?, ?, ?, ?, ?, ?)"
        table.insert(params, 6, data.size)
    else
        print("[Blip Creator] WARNING: 'size' not provided for new blip. Update your script or database for this feature.")
        query = query .. ") VALUES (?, ?, ?, ?, ?, ?)"
    end

    MySQL.insert(query, params, function(id)
        if id then
            RefreshBlips()
        end
    end)
end)

-- Event to update an existing blip
RegisterNetEvent('capo-blipcreator:server:updateBlip', function(data)
    local query = "UPDATE blips SET name = ?, color = ?, sprite = ?"
    local params = {data.name, data.color, data.sprite, data.id}

    if data.size then
        query = query .. ", size = ? WHERE id = ?"
        table.insert(params, 4, data.size)
    else
        print("[Blip Creator] WARNING: 'size' not provided for blip update. Update your script or database for this feature.")
        query = query .. " WHERE id = ?"
    end

    MySQL.update(query, params, function(affectedRows)
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
    TriggerClientEvent('capo-blipcreator:client:receiveBlipsForUI', src, Blips)
end)
