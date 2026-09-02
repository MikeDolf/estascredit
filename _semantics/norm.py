# -*- coding: utf-8 -*-
"""Схлопывание словоформ и порядка слов.

Букварикс отдаёт «купить вилочный погрузчик» и «вилочный погрузчик купить»
как две строки, но для Яндекса это ОДИН запрос: оператор "!слово" фиксирует
словоформу, а не порядок. Складывать такие строки — завышать спрос в 2-3 раза.
Поэтому группируем по отсортированному набору основ и берём максимум, не сумму.

Стеммер грубый: режем частотные русские окончания. Он путает редкие пары,
но на масштабе 400 тысяч фраз это дешевле и честнее, чем считать перестановки
разными запросами.
"""
import re, pickle, collections

ENDINGS = ("ами","ями","ого","ему","ому","ыми","ими","ая","яя","ое","ее","ые",
           "ий","ый","ой","ом","ем","ах","ях","ов","ев","ей","ям","ам","ы","и",
           "а","я","о","е","у","ю")

def stem(w):
    if len(w) <= 4 or not re.fullmatch(r"[а-яё]+", w):
        return w
    for end in ENDINGS:
        if w.endswith(end) and len(w) - len(end) >= 4:
            return w[:-len(end)]
    return w

TOKEN = re.compile(r"[а-яёa-z0-9]+")

def key(phrase):
    return " ".join(sorted(stem(w) for w in TOKEN.findall(phrase)))

if __name__ == "__main__":
    rows = pickle.load(open("rows.pkl","rb"))
    groups = collections.defaultdict(list)
    for p,(b,e) in rows.items():
        groups[key(p)].append((e,b,p))
    out = {}
    for k, items in groups.items():
        items.sort(key=lambda t:(-t[0], len(t[2])))
        e,b,p = items[0]
        out[k] = dict(phrase=p, exact=e, broad=b, forms=len(items))
    pickle.dump(out, open("groups.pkl","wb"))
    print(f"фраз до схлопывания : {len(rows)}")
    print(f"запросов после      : {len(out)}")
    print(f"схлопнуто           : {len(rows)-len(out)} ({(len(rows)-len(out))*100//len(rows)}%)")
    print(f"частотность до      : {sum(v[1] for v in rows.values())}")
    print(f"частотность после   : {sum(v['exact'] for v in out.values())}")
