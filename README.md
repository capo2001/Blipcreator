# 🗺️ Custom Blip Script for FiveM

A lightweight and fully configurable map blip script. Define as many blips as you want in `config.lua`, and they will automatically appear for all players on server join.

---

## 🧰 Requirements

- [`es_extended`](https://github.com/esx-framework/es_extended) *(optional, if using notifications)*
- No database required – blips are defined in the config file.

---

## 🚀 Features

- 🧭 Add static blips to the map
- 🧠 Fully configurable: name, color, sprite, scale, position
- 🔁 Automatically loaded for all players
- ✅ Config option to enable/disable blip visibility
- 🔋 0.00ms idle usage

---

## ⚙️ Configuration (`config.lua`)

```lua
Config = Config or {}

Config.blipsShow = true -- Set to false to disable all blips

Config.Locations = {
    [1] = {
        vector = vector3(918.2582, -952.2790, 42.9540), 
        text = "Over Speed", 
        color = 3, 
        sprite = 446, 
        scale = 0.8,
    },
    [2] = {
        vector = vector3(305.6468, -580.4258, 43.2374), 
        text = "Krankenhaus", 
        color = 1, 
        sprite = 61, 
        scale = 0.8,
    },
    -- ... more entries ...
}
