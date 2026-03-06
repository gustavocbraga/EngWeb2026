import json
import uuid

def generate_id():
    return str(uuid.uuid4())[:8]

def add_actor_list():
    with open('cinema.json', 'r', encoding='utf-8') as f:
        old_data = json.load(f)

    new_filmes = []
    atores_map = {} 

    for f in old_data.get("filmes", []):
        film_id = generate_id()
        film_cast = []
        
        for actor_name in f.get("cast", []):
            if actor_name not in atores_map:
                atores_map[actor_name] = {
                    "id": generate_id(),
                    "actor": actor_name,
                    "films": []
                }
            
            actor_info = atores_map[actor_name]
            film_cast.append({"id": actor_info["id"], "actor": actor_name})
            actor_info["films"].append({"id": film_id, "title": f["title"]})

        new_filmes.append({
            "id": film_id,
            "title": f["title"],
            "year": f["year"],
            "cast": film_cast,
            "genres": f["genres"]
        })

    final_dataset = {
        "filmes": new_filmes,
        "atores": list(atores_map.values())
    }

    with open('cinema.json', 'w', encoding='utf-8') as f:
        json.dump(final_dataset, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    add_actor_list()