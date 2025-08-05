--================================================================================================
--==                                                                                            ==
--==                                   BLIPS CREATOR                                            ==
--==                                                                                            ==
--================================================================================================


--================================================================================================
--==                                                                                            ==
--==                                   [ VAR ]                                                  ==
--==                                                                                            ==
--================================================================================================

local blips = {}


--================================================================================================
--==                                                                                            ==
--==                                   [ FUNCTIONS ]                                            ==
--==                                                                                            ==
--================================================================================================

function DrawBlips()
    for i=1, #blips, 1 do
        local blip = AddBlipForCoord(blips[i].x, blips[i].y, blips[i].z)
        SetBlipSprite(blip, blips[i].sprite)
        SetBlipColour(blip, blips[i].color)
        SetBlipAsShortRange(blip, true)
        BeginTextCommandSetBlipName("STRING")
        AddTextComponentString(blips[i].name)
        EndTextCommandSetBlipName(blip)
    end
end

function ClearBlips()
    for i=1, #blips, 1 do
        RemoveBlip(blips[i])
    end
    blips = {}
end


--================================================================================================
--==                                                                                            ==
--==                                   [ EVENTS ]                                               ==
--==                                                                                            ==
--================================================================================================

RegisterNetEvent('capo-blipcreator:client:sendBlips', function(data)
    ClearBlips()
    blips = data
    DrawBlips()
end)


--================================================================================================
--==                                                                                            ==
--==                                   [ COMMANDS ]                                             ==
--==                                                                                            ==
--================================================================================================

RegisterCommand('blipscreator', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open'
    })
end, false)


--================================================================================================
--==                                                                                            ==
--==                                   [ NUI ]                                                  ==
--==                                                                                            ==
--================================================================================================

RegisterNUICallback('createBlip', function(data, cb)
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    data.x = coords.x
    data.y = coords.y
    data.z = coords.z
    TriggerServerEvent('capo-blipcreator:server:createBlip', data)
    cb('ok')
end)

RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)
