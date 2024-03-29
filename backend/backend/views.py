from json import load
from pathlib import Path

from django.http import HttpRequest, JsonResponse

dir_path = Path(__file__).parent.resolve()


def languages(request: HttpRequest) -> JsonResponse:
    fixtures_dir = dir_path / 'fixtures'
    files = fixtures_dir.glob('*.json')
    file_names_without_json = [file.stem for file in files]

    return JsonResponse(file_names_without_json, safe=False)


def translation(request: HttpRequest, locale: str) -> JsonResponse:
    with open(Path(f'{dir_path}/fixtures/{locale}.json'), 'r') as f:
        return JsonResponse(load(f), safe=False)
