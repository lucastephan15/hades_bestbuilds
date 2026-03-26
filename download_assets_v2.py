#!/usr/bin/env python3
"""Download Hades 1 assets from Fandom Wiki API - v2 with correct filenames."""

import json
import os
import urllib.request
import urllib.parse
import time

BASE = "/Users/lucastephan/Library/Mobile Documents/com~apple~CloudDocs/NekoBit/Hades/assets/images"
API = "https://hades.fandom.com/api.php"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}


def api_query(params):
    params["format"] = "json"
    url = f"{API}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def get_image_url(filename):
    data = api_query({
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url"
    })
    pages = data["query"]["pages"]
    for page in pages.values():
        if "imageinfo" in page:
            return page["imageinfo"][0]["url"]
    return None


def download(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 100:
        print(f"  SKIP: {os.path.basename(dest)}")
        return True
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            with open(dest, "wb") as f:
                f.write(data)
        print(f"  OK: {os.path.basename(dest)} ({len(data)} bytes)")
        return True
    except Exception as e:
        print(f"  FAIL: {os.path.basename(dest)} - {e}")
        return False


# === BOON ICONS (correct names with _I suffix) ===
print("=" * 50)
print("DOWNLOADING BOON ICONS")
print("=" * 50)

boon_files = {
    "zeus": [
        "Lightning_Strike_I.png", "Thunder_Flourish_I.png", "Electric_Shot_I.png",
        "Thunder_Dash_I.png", "Zeus'_Aid_I.png", "Storm_Lightning_I.png",
        "High_Voltage_I.png", "Double_Strike_I.png", "Static_Discharge_I.png",
        "Clouded_Judgment_I.png", "Billowing_Strength_I.png",
        "Lightning_Reflexes_I.png", "Splitting_Bolt_I.png",
    ],
    "athena": [
        "Divine_Strike_I.png", "Divine_Flourish_I.png", "Phalanx_Shot_I.png",
        "Divine_Dash_I.png", "Athena's_Aid_I.png", "Bronze_Skin_I.png",
        "Holy_Shield_I.png", "Brilliant_Riposte_I.png", "Sure_Footing_I.png",
        "Proud_Bearing_I.png", "Blinding_Flash_I.png",
        "Deathless_Stand_I.png", "Last_Stand_I.png",
    ],
    "ares": [
        "Curse_of_Agony_I.png", "Curse_of_Pain_I.png", "Slicing_Shot_I.png",
        "Blade_Dash_I.png", "Ares'_Aid_I.png", "Urge_to_Kill_I.png",
        "Blood_Frenzy_I.png", "Battle_Rage_I.png", "Black_Metal_I.png",
        "Engulfing_Vortex_I.png", "Dire_Misfortune_I.png",
        "Impending_Doom_I.png", "Vicious_Cycle_I.png",
    ],
    "artemis": [
        "Deadly_Strike_I.png", "Deadly_Flourish_I.png", "True_Shot_I.png",
        "Hunter_Dash_I.png", "Artemis'_Aid_I.png", "Pressure_Points_I.png",
        "Exit_Wounds_I.png", "Clean_Kill_I.png", "Support_Fire_I.png",
        "Hide_Breaker_I.png", "Hunter's_Mark_I.png",
        "Fully_Loaded_I.png",
    ],
    "aphrodite": [
        "Heartbreak_Strike_I.png", "Heartbreak_Flourish_I.png", "Crush_Shot_I.png",
        "Passion_Dash_I.png", "Aphrodite's_Aid_I.png", "Dying_Lament_I.png",
        "Wave_of_Despair_I.png", "Different_League_I.png", "Empty_Inside_I.png",
        "Broken_Resolve_I.png", "Blown_Kiss_I.png",
        "Sweet_Surrender_I.png", "Unhealthy_Fixation_I.png",
    ],
    "dionysus": [
        "Drunken_Strike_I.png", "Drunken_Flourish_I.png", "Trippy_Shot_I.png",
        "Drunken_Dash_I.png", "Dionysus'_Aid_I.png", "Premium_Vintage_I.png",
        "Strong_Drink_I.png", "After_Party_I.png", "Positive_Outlook_I.png",
        "High_Tolerance_I.png", "Bad_Influence_I.png",
        "Numbing_Sensation_I.png", "Peer_Pressure_I.png",
        "Black_Out_I.png",
    ],
    "poseidon": [
        "Tempest_Strike_I.png", "Tempest_Flourish_I.png", "Flood_Shot_I.png",
        "Tidal_Dash_I.png", "Poseidon's_Aid_I.png", "Hydraulic_Might_I.png",
        "Sunken_Treasure_I.png", "Ocean's_Bounty_I.png", "Razor_Shoals_I.png",
        "Typhoon's_Fury_I.png", "Breaking_Wave_I.png",
        "Wave_Pounding_I.png", "Rip_Current_I.png",
        "Boiling_Point_I.png", "Second_Wave_I.png", "Huge_Catch_I.png",
    ],
    "demeter": [
        "Frost_Strike_I.png", "Frost_Flourish_I.png", "Crystal_Beam_I.png",
        "Mistral_Dash_I.png", "Demeter's_Aid_I.png", "Snow_Burst_I.png",
        "Ravenous_Will_I.png", "Nourished_Soul_I.png",
        "Frozen_Touch_I.png", "Rare_Crop_I.png",
        "Arctic_Blast_I.png", "Killing_Freeze_I.png",
        "Winter_Harvest_I.png",
    ],
    "hermes": [
        "Swift_Strike_I.png", "Swift_Flourish_I.png", "Flurry_Cast_I.png",
        "Greater_Haste_I.png", "Hyper_Sprint_I.png", "Greatest_Reflex_I.png",
        "Second_Wind_I.png", "Quick_Recovery_I.png", "Rush_Delivery_I.png",
        "Auto_Reload_I.png", "Quick_Favor_I.png",
        "Side_Hustle_I.png", "Greater_Evasion_I.png",
        "Bad_News_I.png",
    ],
}

for god, files in boon_files.items():
    print(f"\n--- {god.upper()} ---")
    dest_dir = os.path.join(BASE, "boons", god)
    os.makedirs(dest_dir, exist_ok=True)
    for filename in files:
        url = get_image_url(filename)
        if url:
            safe = filename.replace("'", "").replace(" ", "_")
            download(url, os.path.join(dest_dir, safe))
        else:
            print(f"  NOT FOUND: {filename}")
        time.sleep(0.2)


# === WEAPONS ===
print("\n" + "=" * 50)
print("DOWNLOADING WEAPON IMAGES")
print("=" * 50)

weapons = {
    "Stygian_Blade.png": "stygian_blade.png",
    "Shield_of_Chaos.png": "shield_of_chaos.png",
    "Infernal_Arms.jpg": "infernal_arms.jpg",
}

# Also try searching for the other weapons
weapon_searches = {
    "Coronacht": "heart_seeking_bow",
    "Varatha": "eternal_spear",
    "Exagryph": "adamant_rail",
    "Malphon": "twin_fists",
    "Heart-Seeking": "heart_seeking_bow",
    "Eternal_Spear": "eternal_spear",
    "Adamant_Rail": "adamant_rail",
    "Twin_Fists": "twin_fists",
}

weapon_dir = os.path.join(BASE, "weapons")
os.makedirs(weapon_dir, exist_ok=True)

for wiki_name, local_name in weapons.items():
    url = get_image_url(wiki_name)
    if url:
        download(url, os.path.join(weapon_dir, local_name))
    else:
        print(f"  NOT FOUND: {wiki_name}")
    time.sleep(0.2)

for prefix, local_name in weapon_searches.items():
    data = api_query({
        "action": "query",
        "list": "allimages",
        "aiprefix": prefix,
        "ailimit": "5"
    })
    imgs = data.get("query", {}).get("allimages", [])
    for img in imgs:
        if img["name"].endswith(".png") or img["name"].endswith(".jpg"):
            ext = img["name"].split(".")[-1]
            dest = os.path.join(weapon_dir, f"{local_name}.{ext}")
            if not os.path.exists(dest) or os.path.getsize(dest) < 100:
                download(img["url"], dest)
            break
    time.sleep(0.2)


# === DUO BOONS ===
print("\n" + "=" * 50)
print("DOWNLOADING DUO BOON ICONS")
print("=" * 50)

duo_dir = os.path.join(BASE, "boons", "duo")
os.makedirs(duo_dir, exist_ok=True)

duo_boons = [
    "Merciful_End_I.png", "Curse_of_Longing_I.png", "Deadly_Reversal_I.png",
    "Lightning_Rod_I.png", "Smoldering_Air_I.png", "Cold_Fusion_I.png",
    "Hunting_Blades_I.png", "Curse_of_Nausea_I.png",
    "Ice_Wine_I.png", "Scintillating_Feast_I.png",
    "Crystal_Clarity_I.png", "Stubborn_Roots_I.png",
    "Low_Tolerance_I.png", "Exclusive_Access_I.png",
    "Sweet_Nectar_I.png", "Calculated_Risk_I.png",
    "Parting_Shot_I.png", "Heart_Rend_I.png",
    "Sea_Storm_I.png", "Mirage_Shot_I.png",
    "Lightning_Phalanx_I.png", "Curse_of_Drowning_I.png",
    "Freezing_Vortex_I.png", "Blizzard_Shot_I.png",
    "Unshakable_Mettle_I.png", "Vengeful_Mood_I.png",
]

for filename in duo_boons:
    url = get_image_url(filename)
    if url:
        safe = filename.replace("'", "").replace(" ", "_")
        download(url, os.path.join(duo_dir, safe))
    else:
        print(f"  NOT FOUND: {filename}")
    time.sleep(0.2)


# === GOD SYMBOLS (for the build cards) ===
print("\n" + "=" * 50)
print("DOWNLOADING GOD SYMBOLS")
print("=" * 50)

symbols = [
    "Zeus_symbol.png", "Athena_symbol.png", "Ares_symbol.png",
    "Artemis_symbol.png", "Aphrodite_symbol.png", "Dionysus_symbol.png",
    "Poseidon_symbol.png", "Demeter_symbol.png", "Hermes_symbol.png",
    "Chaos_symbol.png",
]

ui_dir = os.path.join(BASE, "ui")
for filename in symbols:
    url = get_image_url(filename)
    if url:
        download(url, os.path.join(ui_dir, filename))
    else:
        print(f"  NOT FOUND: {filename}")
    time.sleep(0.2)

# Aspect images
print("\n" + "=" * 50)
print("DOWNLOADING ASPECT IMAGES")
print("=" * 50)

aspects = [
    "Zeus_Aspect.png", "Hades_Aspect.png", "Poseidon_Aspect.png",
    "Nemesis_Aspect.png", "Chiron_Aspect.png", "Hera_Aspect.png",
    "Zagreus_Aspect.png", "Chaos_Aspect.png", "Beowulf_Aspect.png",
    "Achilles_Aspect.png", "Guan_Yu_Aspect.png",
    "Talos_Aspect.png", "Demeter_Aspect.png", "Gilgamesh_Aspect.png",
    "Eris_Aspect.png", "Hestia_Aspect.png", "Lucifer_Aspect.png",
    "Arthur_Aspect.png",
]

aspect_dir = os.path.join(BASE, "weapons")
for filename in aspects:
    url = get_image_url(filename)
    if url:
        download(url, os.path.join(aspect_dir, filename))
    else:
        print(f"  NOT FOUND: {filename}")
    time.sleep(0.2)


print("\n" + "=" * 50)
print("DOWNLOAD V2 COMPLETE!")
print("=" * 50)
