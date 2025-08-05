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
            -- The UI needs a unique ID. We'll use the database ID.
            table.insert(Blips, {
                id = result[i].id, -- Make sure your table has an auto-incrementing `id` column
                name = result[i].name,
                color = result[i].color,
                sprite = result[i].sprite,
                x = result[i].x,
                y = result[i].y,
                z = result[i].z
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

-- Event to delete a blip, called from client.lua
RegisterNetEvent('capo-blipcreator:server:deleteBlip', function(data)
    -- The React UI now sends the blip ID for deletion.
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

-- Note: The original `install.sql` might not have an `id` column.
-- For the UI to work best, especially with deletion, an auto-incrementing primary key `id` is recommended.
-- Example `install.sql` change:
-- CREATE TABLE `blips` (
--  `id` INT(11) NOT NULL AUTO_INCREMENT,
--  `name` VARCHAR(255) NOT NULL,
--  `color` INT(11) NOT NULL,
--  `sprite` INT(11) NOT NULL,
--  `x` FLOAT NOT NULL,
--  `y` FLOAT NOT NULL,
--  `z` FLOAT NOT NULL,
--  PRIMARY KEY (`id`)
-- );
-- I will assume this structure is in place.
