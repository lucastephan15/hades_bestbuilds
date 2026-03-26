#!/usr/bin/env python3
"""Download Hades 1 assets from Fandom Wiki API."""

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
    """Get direct URL for a wiki file."""
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
    """Download file if not already exists."""
    if os.path.exists(dest) and os.path.getsize(dest) > 100:
        print(f"  SKIP (exists): {dest}")
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
        print(f"  FAIL: {dest} - {e}")
        return False


def search_and_download(prefix, dest_dir, limit=50):
    """Search for images by prefix and download them."""
    os.makedirs(dest_dir, exist_ok=True)
    data = api_query({
        "action": "query",
        "list": "allimages",
        "aiprefix": prefix,
        "ailimit": str(limit)
    })
    images = data.get("query", {}).get("allimages", [])
    count = 0
    for img in images:
        name = img["name"]
        url = img["url"]
        safe_name = name.replace("'", "").replace(" ", "_")
        dest = os.path.join(dest_dir, safe_name)
        if download(url, dest):
            count += 1
        time.sleep(0.3)
    return count


# === GOD PORTRAITS ===
print("=" * 50)
print("DOWNLOADING GOD PORTRAITS")
print("=" * 50)

gods = {
    "zeus": "Zeus.png",
    "athena": "Athena.png",
    "ares": "Ares.png",
    "artemis": "Artemis.png",
    "aphrodite": "Aphrodite.png",
    "dionysus": "Dionysus.png",
    "poseidon": "Poseidon.png",
    "demeter": "Demeter.png",
    "hermes": "Hermes.png",
    "chaos": "Chaos.png",
}

for god, filename in gods.items():
    dest_dir = os.path.join(BASE, "boons", god)
    os.makedirs(dest_dir, exist_ok=True)
    url = get_image_url(filename)
    if url:
        download(url, os.path.join(dest_dir, f"{god}_portrait.png"))
    time.sleep(0.3)


# === BOON ICONS PER GOD ===
print("\n" + "=" * 50)
print("DOWNLOADING BOON ICONS")
print("=" * 50)

# Boon icon naming patterns on the wiki
boon_files = {
    "zeus": [
        "Lightning_Strike.png", "Thunder_Flourish.png", "Electric_Shot.png",
        "Thunder_Dash.png", "Zeus'_Aid.png", "Storm_Lightning.png",
        "High_Voltage.png", "Double_Strike.png", "Static_Discharge.png",
        "Clouded_Judgment.png", "Billowing_Strength.png",
        "Lightning_Reflexes.png", "Splitting_Bolt.png",
    ],
    "athena": [
        "Divine_Strike.png", "Divine_Flourish.png", "Phalanx_Shot.png",
        "Divine_Dash.png", "Athena's_Aid.png", "Bronze_Skin.png",
        "Holy_Shield.png", "Brilliant_Riposte.png", "Sure_Footing.png",
        "Proud_Bearing.png", "Blinding_Flash.png",
        "Deathless_Stand.png", "Last_Stand.png",
    ],
    "ares": [
        "Curse_of_Agony.png", "Curse_of_Pain.png", "Slicing_Shot.png",
        "Blade_Dash.png", "Ares'_Aid.png", "Urge_to_Kill.png",
        "Blood_Frenzy.png", "Battle_Rage.png", "Black_Metal.png",
        "Engulfing_Vortex.png", "Dire_Misfortune.png",
        "Impending_Doom.png", "Vicious_Cycle.png",
    ],
    "artemis": [
        "Deadly_Strike.png", "Deadly_Flourish.png", "True_Shot.png",
        "Hunter_Dash.png", "Artemis'_Aid.png", "Pressure_Points.png",
        "Exit_Wounds.png", "Clean_Kill.png", "Support_Fire.png",
        "Hide_Breaker.png", "Hunter's_Mark.png",
        "Fully_Loaded.png",
    ],
    "aphrodite": [
        "Heartbreak_Strike.png", "Heartbreak_Flourish.png", "Crush_Shot.png",
        "Passion_Dash.png", "Aphrodite's_Aid.png", "Dying_Lament.png",
        "Wave_of_Despair.png", "Different_League.png", "Empty_Inside.png",
        "Broken_Resolve.png", "Blown_Kiss.png",
        "Sweet_Surrender.png", "Unhealthy_Fixation.png",
    ],
    "dionysus": [
        "Drunken_Strike.png", "Drunken_Flourish.png", "Trippy_Shot.png",
        "Drunken_Dash.png", "Dionysus'_Aid.png", "Premium_Vintage.png",
        "Strong_Drink.png", "After_Party.png", "Positive_Outlook.png",
        "High_Tolerance.png", "Bad_Influence.png",
        "Numbing_Sensation.png", "Peer_Pressure.png",
        "Black_Out.png",
    ],
    "poseidon": [
        "Tempest_Strike.png", "Tempest_Flourish.png", "Flood_Shot.png",
        "Tidal_Dash.png", "Poseidon's_Aid.png", "Hydraulic_Might.png",
        "Sunken_Treasure.png", "Ocean's_Bounty.png", "Razor_Shoals.png",
        "Typhoon's_Fury.png", "Breaking_Wave.png",
        "Wave_Pounding.png", "Rip_Current.png",
        "Boiling_Point.png", "Second_Wave.png", "Huge_Catch.png",
    ],
    "demeter": [
        "Frost_Strike.png", "Frost_Flourish.png", "Crystal_Beam.png",
        "Mistral_Dash.png", "Demeter's_Aid.png", "Snow_Burst.png",
        "Ravenous_Will.png", "Nourished_Soul.png", "Hard_Labor.png",
        "Frozen_Touch.png", "Rare_Crop.png",
        "Arctic_Blast.png", "Killing_Freeze.png",
        "Winter_Harvest.png",
    ],
    "hermes": [
        "Swift_Strike.png", "Swift_Flourish.png", "Flurry_Cast.png",
        "Greater_Haste.png", "Hyper_Sprint.png", "Greatest_Reflex.png",
        "Second_Wind.png", "Quick_Recovery.png", "Rush_Delivery.png",
        "Auto_Reload.png", "Quick_Favor.png",
        "Side_Hustle.png", "Greater_Evasion.png",
        "Bad_News.png",
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
        time.sleep(0.3)


# === WEAPONS ===
print("\n" + "=" * 50)
print("DOWNLOADING WEAPON IMAGES")
print("=" * 50)

weapons = {
    "Stygius.png": "stygian_blade.png",
    "Coronacht.png": "heart_seeking_bow.png",
    "Aegis.png": "shield_of_chaos.png",
    "Varatha.png": "eternal_spear.png",
    "Exagryph.png": "adamant_rail.png",
    "Malphon.png": "twin_fists.png",
}

weapon_dir = os.path.join(BASE, "weapons")
os.makedirs(weapon_dir, exist_ok=True)

for wiki_name, local_name in weapons.items():
    url = get_image_url(wiki_name)
    if url:
        download(url, os.path.join(weapon_dir, local_name))
    else:
        print(f"  NOT FOUND: {wiki_name}")
    time.sleep(0.3)


# === KEEPSAKES ===
print("\n" + "=" * 50)
print("DOWNLOADING KEEPSAKE IMAGES")
print("=" * 50)

keepsakes = [
    "Old_Spiked_Collar.png", "Myrmidon_Bracer.png", "Black_Shawl.png",
    "Lambent_Plume.png", "Cosmic_Egg.png", "Chthonic_Coin_Purse.png",
    "Skull_Earring.png", "Distant_Memory.png", "Lucky_Tooth.png",
    "Thunder_Signet.png", "Conch_Shell.png", "Owl_Pendant.png",
    "Eternal_Rose.png", "Blood-Filled_Vial.png", "Adamantine_Arrowhead.png",
    "Overflowing_Cup.png", "Frostbitten_Horn.png", "Pierced_Butterfly.png",
    "Bone_Hourglass.png", "Evergreen_Acorn.png", "Broken_Spearpoint.png",
    "Pom_Blossom.png", "Harpy_Feather_Duster.png", "Shattered_Shackle.png",
    "Sigil_of_the_Dead.png",
]

keepsake_dir = os.path.join(BASE, "keepsakes")
os.makedirs(keepsake_dir, exist_ok=True)

for filename in keepsakes:
    url = get_image_url(filename)
    if url:
        safe = filename.replace("'", "").replace(" ", "_").replace("-", "_")
        download(url, os.path.join(keepsake_dir, safe))
    else:
        print(f"  NOT FOUND: {filename}")
    time.sleep(0.3)


# === UI / BACKGROUND ===
print("\n" + "=" * 50)
print("DOWNLOADING UI ELEMENTS")
print("=" * 50)

ui_files = [
    "Zagreus.png",
    "Hades_keyart.jpg",
]

ui_dir = os.path.join(BASE, "ui")
os.makedirs(ui_dir, exist_ok=True)

for filename in ui_files:
    url = get_image_url(filename)
    if url:
        download(url, os.path.join(ui_dir, filename))
    else:
        print(f"  NOT FOUND: {filename}")
    time.sleep(0.3)


print("\n" + "=" * 50)
print("DOWNLOAD COMPLETE!")
print("=" * 50)
