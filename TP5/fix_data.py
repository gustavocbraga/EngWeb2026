import json
import uuid

def fix_data():
    with open("cinema.json", 'r', encoding='utf-8') as file:
        data = json.load(file)

    for f in data["filmes"]:
        if "id" not in f:
            f["id"] = str(uuid.uuid4())[:8]
    
    with open("cinema.json", 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    fix_data()