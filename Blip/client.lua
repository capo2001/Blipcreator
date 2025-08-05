--================================================================================================
--==                                                                                            ==
--==                          BLIPS CREATOR - React Version by Jules                            ==
--==                                                                                            ==
--================================================================================================

local blips = {}
local blipHandles = {} -- Keep track of created blip handles to remove them correctly

--================================================================================================
--==                                   [ FUNCTIONS ]                                            ==
--================================================================================================

function ClearBlips()
    for i, handle in ipairs(blipHandles) do
        RemoveBlip(handle)
    end
    blipHandles = {}
    blips = {}
end

function DrawBlips()
    -- First, clear any existing blip handles before redrawing
    for i, handle in ipairs(blipHandles) do
        RemoveBlip(handle)
    end
    blipHandles = {}

    for i, blipInfo in ipairs(blips) do
        local blip = AddBlipForCoord(blipInfo.x, blipInfo.y, blipInfo.z)
        SetBlipSprite(blip, blipInfo.sprite)
        SetBlipColour(blip, blipInfo.color)
        SetBlipAsShortRange(blip, true)
        BeginTextCommandSetBlipName("STRING")
        AddTextComponentString(blipInfo.name)
        EndTextCommandSetBlipName(blip)
        table.insert(blipHandles, blip)
    end
end

--================================================================================================
--==                                   [ EVENTS ]                                               ==
--================================================================================================

-- Receives the master list of blips from the server
RegisterNetEvent('capo-blipcreator:client:sendBlips', function(data)
    blips = data
    DrawBlips()
    -- Also send the updated list to the UI if it's open
    SendNUIMessage({
        action = 'updateBlips',
        data = blips
    })
end)

-- Receives blips specifically for the UI (e.g., on initial load)
RegisterNetEvent('capo-blipcreator:client:receiveBlipsForUI', function(data)
    SendNUIMessage({
        action = 'updateBlips',
        data = data
    })
end)

--================================================================================================
--==                                   [ COMMANDS ]                                             ==
--================================================================================================

RegisterCommand('blipscreator', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'setVisible',
        data = true
    })
end, false)

--================================================================================================
--==                                   [ NUI CALLBACKS ]                                        ==
--================================================================================================

RegisterNUICallback('createBlip', function(data, cb)
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    data.x = coords.x
    data.y = coords.y
    data.z = coords.z
    TriggerServerEvent('capo-blipcreator:server:createBlip', data)
    cb({ ok = true })
end)

RegisterNUICallback('deleteBlip', function(data, cb)
    if data and data.name then
        TriggerServerEvent('capo-blipcreator:server:deleteBlip', data)
        cb({ ok = true })
    else
        cb({ ok = false, error = 'Invalid data' })
    end
end)

RegisterNUICallback('getBlips', function(data, cb)
    -- Request fresh blips from the server for the UI
    TriggerServerEvent('capo-blipcreator:server:getBlipsForUI')
    cb({ ok = true })
end)

RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'setVisible',
        data = false
    })
    cb({ ok = true })
end)
