from __future__ import annotations

from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_FILE = OUTPUT_DIR / "dragon-street-food-prirucka-aktualizovana.pdf"
LOGO = ROOT / "public" / "images" / "dragon-logo.png"
HERO = ROOT / "public" / "images" / "hero-bg.jpg"

ONLINE_URL = "https://web-one-delta-96.vercel.app"
ADMIN_PASSWORD = "DragonStreet-2026-Test"
KITCHEN_PASSWORD = "DragonStreet-2026-Test"
COURIER_PASSWORD = "DragonStreet-2026-Test"


def register_fonts() -> tuple[str, str]:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("ManualRegular", str(regular)))
        pdfmetrics.registerFont(TTFont("ManualBold", str(bold)))
        return "ManualRegular", "ManualBold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def styles():
    base = getSampleStyleSheet()
    base.add(
        ParagraphStyle(
            name="CoverTitle",
            fontName=FONT_BOLD,
            fontSize=30,
            leading=34,
            textColor=colors.HexColor("#1A1A2E"),
            alignment=TA_CENTER,
            spaceAfter=10,
        )
    )
    base.add(
        ParagraphStyle(
            name="CoverSub",
            fontName=FONT,
            fontSize=12.5,
            leading=18,
            textColor=colors.HexColor("#4B5563"),
            alignment=TA_CENTER,
            spaceAfter=18,
        )
    )
    base.add(
        ParagraphStyle(
            name="Title1",
            fontName=FONT_BOLD,
            fontSize=20,
            leading=25,
            textColor=colors.HexColor("#1A1A2E"),
            spaceBefore=10,
            spaceAfter=8,
        )
    )
    base.add(
        ParagraphStyle(
            name="Title2",
            fontName=FONT_BOLD,
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#C1121F"),
            spaceBefore=12,
            spaceAfter=6,
        )
    )
    base.add(
        ParagraphStyle(
            name="Title3",
            fontName=FONT_BOLD,
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#1A1A2E"),
            spaceBefore=6,
            spaceAfter=4,
        )
    )
    base.add(
        ParagraphStyle(
            name="Body",
            fontName=FONT,
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#1F2937"),
            spaceAfter=5,
        )
    )
    base.add(
        ParagraphStyle(
            name="Small",
            fontName=FONT,
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#4B5563"),
            spaceAfter=4,
        )
    )
    base.add(
        ParagraphStyle(
            name="TableHead",
            fontName=FONT_BOLD,
            fontSize=8.7,
            leading=11,
            textColor=colors.white,
            alignment=TA_LEFT,
        )
    )
    base.add(
        ParagraphStyle(
            name="TableCell",
            fontName=FONT,
            fontSize=8.3,
            leading=10.7,
            textColor=colors.HexColor("#1F2937"),
        )
    )
    base.add(
        ParagraphStyle(
            name="Callout",
            fontName=FONT_BOLD,
            fontSize=9.3,
            leading=13,
            textColor=colors.HexColor("#1A1A2E"),
        )
    )
    return base


S = styles()


def p(text: str, style: str = "Body") -> Paragraph:
    return Paragraph(text, S[style])


def bullet(items: list[str]) -> ListFlowable:
    return ListFlowable(
        [ListItem(p(item), leftIndent=4) for item in items],
        bulletType="bullet",
        bulletFontName=FONT_BOLD,
        bulletFontSize=7,
        leftIndent=14,
        bulletIndent=4,
        spaceBefore=2,
        spaceAfter=6,
    )


def table(data: list[list[str]], widths: list[float] | None = None) -> Table:
    converted = []
    for row_index, row in enumerate(data):
        style_name = "TableHead" if row_index == 0 else "TableCell"
        converted.append([p(cell, style_name) for cell in row])
    t = Table(converted, colWidths=widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1A1A2E")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FFF8F0")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#E5DDD5")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return t


def callout(title: str, text: str, fill: str = "#FFF8F0", stroke: str = "#F4A261") -> Table:
    box = Table(
        [[p(f"<b>{title}</b><br/>{text}", "Callout")]],
        colWidths=[17.0 * cm],
        hAlign="LEFT",
    )
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(fill)),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor(stroke)),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return box


def section(title: str) -> list:
    return [Spacer(1, 4), p(title, "Title1")]


def subsection(title: str) -> list:
    return [p(title, "Title2")]


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(colors.HexColor("#1A1A2E"))
    canvas.rect(0, height - 10 * mm, width, 10 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont(FONT_BOLD, 8)
    canvas.drawString(18 * mm, height - 6.5 * mm, "Dragon Street Food Hlohovec - používateľská príručka")
    canvas.setFont(FONT, 8)
    canvas.drawRightString(width - 18 * mm, height - 6.5 * mm, ONLINE_URL)
    canvas.setFillColor(colors.HexColor("#6B7280"))
    canvas.setFont(FONT, 8)
    canvas.drawCentredString(width / 2, 10 * mm, f"Strana {doc.page}")
    canvas.restoreState()


def cover(story: list):
    story.append(Spacer(1, 12 * mm))
    if LOGO.exists():
        story.append(Image(str(LOGO), width=34 * mm, height=34 * mm, hAlign="CENTER"))
        story.append(Spacer(1, 6 * mm))
    story.append(p("Dragon Street Food Hlohovec", "CoverTitle"))
    story.append(p("Prehľadná používateľská príručka k webu, objednávkam a interným panelom", "CoverSub"))
    if HERO.exists():
        img = Image(str(HERO), width=16.4 * cm, height=7.0 * cm)
        img.hAlign = "CENTER"
        story.append(img)
        story.append(Spacer(1, 8 * mm))
    story.append(
        callout(
            "Online adresa",
            f"Web je dostupný na: <b>{ONLINE_URL}</b><br/>Interné panely sa otvárajú cez horné menu alebo priamo cez odkazy uvedené v tejto príručke.",
            fill="#F7F7FB",
            stroke="#1A1A2E",
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(
        callout(
            "Dôležité",
            "Príručka obsahuje heslá pre interné panely. PDF neposielajte verejne zákazníkom ani ho nezverejňujte na webe.",
            fill="#FFF3F3",
            stroke="#E63946",
        )
    )
    story.append(Spacer(1, 8 * mm))
    story.append(p(f"Verzia dokumentu: {datetime.now().strftime('%d.%m.%Y')}", "Small"))
    story.append(PageBreak())


def build_story() -> list:
    story: list = []
    cover(story)

    story += section("1. Rýchly štart")
    story.append(p("Táto príručka je určená pre bežného používateľa webu aj pre obsluhu prevádzky. Popisuje, kde čo nájdete, ako vytvoriť objednávku, ako pracovať s objednávkami v admin paneli, ako používať kuchynský panel a ako má kuriér meniť stav doručenia."))
    story.append(
        table(
            [
                ["Čo chcem urobiť", "Kam kliknúť", "Poznámka"],
                ["Pozrieť ponuku jedál", "Menu", "Zákazník môže filtrovať kategórie, pridať jedlá do košíka a pokračovať k objednávke."],
                ["Vytvoriť objednávku", "Košík vpravo hore alebo Objednať online", "Objednávka funguje pre rozvoz aj osobný odber."],
                ["Spravovať objednávky", "Admin", "Vyžaduje admin heslo."],
                ["Vybavovať prípravu jedál", "Kuchyňa", "Vyžaduje kuchynské heslo."],
                ["Doručovať objednávky", "Kuriér", "Vyžaduje kuriérske heslo."],
            ],
            [4.2 * cm, 4.2 * cm, 8.6 * cm],
        )
    )

    story += subsection("Priame odkazy")
    story.append(
        table(
            [
                ["Sekcia", "URL"],
                ["Domov", f"{ONLINE_URL}/#home"],
                ["Menu", f"{ONLINE_URL}/#menu"],
                ["Košík a objednávka", f"{ONLINE_URL}/#checkout"],
                ["Sledovanie objednávky", f"{ONLINE_URL}/#order-tracking"],
                ["Admin panel", f"{ONLINE_URL}/#admin"],
                ["Kuchynský panel", f"{ONLINE_URL}/#kitchen"],
                ["Kuriérsky panel", f"{ONLINE_URL}/#courier"],
                ["O nás", f"{ONLINE_URL}/#about"],
                ["Kontakt", f"{ONLINE_URL}/#contact"],
            ],
            [4.4 * cm, 12.6 * cm],
        )
    )

    story += section("2. Heslá a prístupy")
    story.append(
        callout(
            "Testovacie heslá",
            f"Admin panel: <b>{ADMIN_PASSWORD}</b><br/>Kuchynský panel: <b>{KITCHEN_PASSWORD}</b><br/>Kuriérsky panel: email kuriéra + <b>{COURIER_PASSWORD}</b>",
            fill="#FFF8F0",
            stroke="#F4A261",
        )
    )
    story.append(Spacer(1, 5))
    story.append(p("Heslo sa zadáva po otvorení príslušného interného panelu. Po úspešnom prihlásení si prehliadač uloží prístup do cookie, takže pri ďalšom otvorení toho istého panelu nemusí pýtať heslo hneď znova."))
    story.append(
        bullet(
            [
                "Admin heslo používajte iba pre majiteľa alebo zodpovednú obsluhu.",
                "Kuchynské heslo dajte pracovníkom, ktorí menia stav prípravy objednávok.",
                "Kuriér sa prihlasuje svojim emailom z karty kuriéra a spoločným kuriérskym heslom.",
                "Ak heslo unikne mimo prevádzky, treba ho zmeniť vo Vercel environment premenných a znovu nasadiť web.",
            ]
        )
    )

    story += section("3. Ako zákazník objednáva")
    story.append(p("Zákazník nepotrebuje žiadne heslo. Prejde na web, otvorí menu, vyberie jedlá a dokončí objednávku v košíku."))
    story += subsection("Postup objednávky")
    story.append(
        table(
            [
                ["Krok", "Čo zákazník urobí", "Výsledok"],
                ["1", "Klikne na Menu alebo Objednať online.", "Zobrazí sa ponuka jedál a kategórií."],
                ["2", "Vyberie jedlo, prípadne doplnky a počet kusov.", "Jedlo sa pridá do košíka."],
                ["3", "Otvorí košík vpravo hore.", "Vidí položky, cenu a môže pokračovať k formuláru."],
                ["4", "Vyplní meno, telefón, adresu alebo zvolí osobný odber.", "Systém pripraví objednávku na odoslanie."],
                ["5", "Zvolí platobnú metódu a potvrdí objednávku.", "Objednávka sa uloží a zobrazí sa sledovanie stavu."],
            ],
            [1.2 * cm, 8.0 * cm, 7.8 * cm],
        )
    )
    story += subsection("Čo si má zákazník skontrolovať")
    story.append(
        bullet(
            [
                "Správne telefónne číslo, aby sa s ním prevádzka alebo kuriér vedeli spojiť.",
                "Presnú adresu, poschodie, zvonček a poznámku pre kuriéra.",
                "Poznámky ku kuchyni, napríklad bez cibule, viac pikantné alebo alergény.",
                "Či ide o rozvoz alebo osobný odber.",
            ]
        )
    )

    story += section("4. Sledovanie objednávky")
    story.append(p("Po vytvorení objednávky sa zákazník dostane na stránku sledovania. Vidí číslo objednávky, aktuálny stav a základné údaje. Ak sa vráti neskôr, môže použiť sekciu Sledovanie objednávky."))
    story.append(
        table(
            [
                ["Stav", "Význam pre zákazníka"],
                ["Vytvorená / prijatá", "Objednávka je v systéme a čaká na spracovanie."],
                ["Pripravuje sa", "Kuchyňa na objednávke pracuje."],
                ["Hotová / pripravená", "Jedlo je pripravené na vyzdvihnutie alebo prevzatie kuriérom."],
                ["Kuriér pridelený / na ceste", "Objednávka je v doručovacom procese."],
                ["Doručená / dokončená", "Objednávka je vybavená."],
                ["Problém", "Treba kontaktovať prevádzku alebo zákazníka."],
            ],
            [5.3 * cm, 11.7 * cm],
        )
    )

    story += section("5. Admin panel")
    story.append(p(f"Admin panel otvoríte cez horné menu alebo priamo na <b>{ONLINE_URL}/#admin</b>. Po otvorení zadajte admin heslo."))
    story += subsection("Karty v admin paneli")
    story.append(
        table(
            [
                ["Karta", "Na čo slúži"],
                ["Objednávky", "Prehľad nových a aktívnych objednávok, zmena stavu, priradenie kuriéra a označenie problému."],
                ["Menu", "Správa položiek menu: názov, kategória, cena, dostupnosť, obrázok, štítky a doplnky."],
                ["Kuriéri", "Zapínanie online/dostupný stav kuriérov a kontrola ich aktívnych objednávok."],
                ["Štatistiky", "Rýchly prehľad výkonu prevádzky a objednávok."],
                ["Marketing", "Pomôcka na prípravu textov pre Facebook, Instagram a story."],
            ],
            [3.5 * cm, 13.5 * cm],
        )
    )
    story += subsection("Práca s objednávkami")
    story.append(
        bullet(
            [
                "Novú objednávku najprv skontrolujte: meno, telefón, adresa, položky, poznámky a platba.",
                "Ak je všetko v poriadku, nastavte stav Prijatá alebo Pripravuje sa.",
                "Keď je jedlo hotové, nastavte Hotové / pripravené na vyzdvihnutie.",
                "Pri rozvoze priraďte kuriéra alebo nechajte systém/kuriéra objednávku prevziať.",
                "Ak je problém, použite stav Problém a zapíšte dôvod.",
            ]
        )
    )
    story += subsection("Správa menu")
    story.append(
        table(
            [
                ["Úkon", "Postup"],
                ["Pridať položku", "V karte Menu vyplňte názov, kategóriu, cenu, popis a dostupnosť. Potom uložte."],
                ["Upraviť položku", "Kliknite na ikonu ceruzky pri položke, upravte údaje a uložte."],
                ["Nahrať obrázok", "Vyberte obrázok pri položke menu. Súbor sa uloží cez upload API."],
                ["Skryť položku", "Vypnite dostupnosť položky. Zákazník ju nebude môcť objednať."],
                ["Vymazať položku", "Použite ikonu koša iba vtedy, keď položku už nechcete mať v databáze."],
            ],
            [4.0 * cm, 13.0 * cm],
        )
    )

    story += section("6. Kuchynský panel")
    story.append(p(f"Kuchynský panel otvoríte na <b>{ONLINE_URL}/#kitchen</b>. Je navrhnutý pre rýchlu prácu počas prevádzky. Objednávky sa obnovujú automaticky približne každých 10 sekúnd."))
    story.append(
        table(
            [
                ["Karta", "Čo znamená"],
                ["Aktívne", "Objednávky, ktoré treba pripraviť alebo sa práve pripravujú."],
                ["Hotové", "Objednávky pripravené na výdaj, odber alebo kuriéra."],
            ],
            [4.0 * cm, 13.0 * cm],
        )
    )
    story += subsection("Odporúčaný postup v kuchyni")
    story.append(
        bullet(
            [
                "Novú prijatú objednávku otvorte a skontrolujte položky a poznámky.",
                "Kliknite na Začať pripravovať, keď kuchyňa začne robiť objednávku.",
                "Po dokončení kliknite na Hotové.",
                "Pri osobnom odbere môže obsluha po vydaní dokončiť objednávku.",
                "Pri rozvoze čaká hotová objednávka na priradenie alebo prevzatie kuriérom.",
            ]
        )
    )

    story += section("7. Kuriérsky panel")
    story.append(p(f"Kuriérsky panel otvoríte na <b>{ONLINE_URL}/#courier</b>. Kuriér sa prihlasuje emailom a heslom. Po prihlásení panel automaticky pracuje s jeho kuriérskym účtom, zobrazuje nové, aktívne, doručené a problémové objednávky."))
    story.append(
        table(
            [
                ["Časť panela", "Ako ju používať"],
                ["Dostupnosť", "Prepínač zapnite, keď kuriér môže prijímať objednávky. Vypnite pri pauze alebo konci smeny."],
                ["Nové", "Objednávky pripravené v kuchyni. Kuriér ich môže prijať alebo odmietnuť."],
                ["Aktívne", "Objednávky, ktoré kuriér prijal a práve ich doručuje. Pri každej vidí zárobok kuriéra, cenu objednávky, adresu, telefón a položky."],
                ["Doručené", "História doručených objednávok so zárobkom za každú objednávku, cenou objednávky a celkovým súčtom."],
                ["Problém", "Objednávky označené ako problém, napríklad zlá adresa alebo nedostupný zákazník."],
                ["Notifikácie", "Tlačidlom Zapnúť notifikácie povolíte upozornenia v prehliadači. Zvuk sa dá zapnúť alebo vypnúť samostatne."],
                ["Pridať na plochu", "Na mobile použite tlačidlo Pridať na plochu alebo menu prehliadača. Panel sa potom otvorí ako samostatná aplikácia."],
            ],
            [4.4 * cm, 12.6 * cm],
        )
    )
    story += subsection("Cena objednávky a zárobok kuriéra")
    story.append(
        table(
            [
                ["Údaj v paneli", "Čo znamená"],
                ["Zárobok kuriéra", "Suma, ktorú kuriér zarobí za doručenie konkrétnej objednávky. Aktuálne sa počíta ako poplatok za doručenie pri objednávke."],
                ["Cena objednávky", "Celková suma platená zákazníkom. Zahŕňa jedlo, doplnky, prípadný poplatok za doručenie a zľavy podľa nastavenia objednávky."],
                ["Kam smeruje objednávka", "Adresa doručenia pre kuriéra. Pri každej objednávke ju treba skontrolovať spolu s telefónom a poznámkou."],
                ["Tržba v doručených", "Súčet cien doručených objednávok. Nie je to zárobok kuriéra, ale suma objednávok pre prevádzku."],
            ],
            [4.4 * cm, 12.6 * cm],
        )
    )
    story += subsection("Kroky doručenia")
    story.append(
        table(
            [
                ["Poradie", "Stav", "Kedy kliknúť"],
                ["1", "Prijať", "Keď kuriér berie objednávku na seba. Odmietnuť použite, ak ju nemôže doručiť."],
                ["2", "Idem po jedlo", "Keď kuriér smeruje do prevádzky po objednávku."],
                ["3", "Vyzdvihnuté", "Keď kuriér fyzicky prebral objednávku."],
                ["4", "Na ceste k zákazníkovi", "Keď objednávka smeruje k zákazníkovi."],
                ["5", "Doručené", "Keď zákazník objednávku prevzal."],
            ],
            [1.8 * cm, 5.6 * cm, 9.6 * cm],
        )
    )

    story += section("8. Marketing a zdieľanie")
    story.append(p("Web obsahuje jednoduché zdieľacie prvky a admin pomôcku na texty pre sociálne siete. Facebook zdieľanie otvorí zdieľacie okno. Instagram vo webovom prehliadači nepodporuje priame zdieľanie do feedu tak ako Facebook, preto sa text pripravuje na kopírovanie."))
    story.append(
        bullet(
            [
                "Používajte krátke texty s jasnou výzvou: objednaj online, akcia dňa, týždenný špeciál.",
                "Pri Instagrame skopírujte text a vložte ho do príspevku, stories alebo bio kampane.",
                "Pri marketingových textoch vždy skontrolujte cenu, dostupnosť jedla a dátum akcie.",
            ]
        )
    )

    story += section("9. Riešenie bežných problémov")
    story.append(
        table(
            [
                ["Problém", "Čo skúsiť"],
                ["Nevidím nové objednávky", "Obnovte stránku. Skontrolujte internet. V interných paneloch sa objednávky načítavajú z API a obnovujú priebežne."],
                ["Panel pýta heslo", "Zadajte heslo pre konkrétny panel. Admin, kuchyňa a kuriér majú samostatný prístup."],
                ["Objednávka nejde odoslať", "Skontrolujte otváracie hodiny, povinné údaje, telefón a či je povolené online objednávanie."],
                ["Kuriér nevidí objednávku", "Skontrolujte, či ide o rozvoz, či je objednávka pripravená a či má kuriér zapnutú dostupnosť."],
                ["Zákazník volá kvôli stavu", "Vyhľadajte objednávku v admin paneli podľa čísla, mena alebo telefónu a skontrolujte históriu/stav."],
                ["Zlá položka v menu", "Opravte ju v Admin > Menu a uložte. Ak treba, dočasne vypnite dostupnosť."],
            ],
            [5.0 * cm, 12.0 * cm],
        )
    )

    story += section("10. Bezpečnosť a dobrá prax")
    story.append(
        callout(
            "Heslá v tomto PDF",
            "Tento dokument je praktický manuál pre prevádzku, preto obsahuje aj prístupy. Držte ho iba interne. Po skončení testovania odporúčame nastaviť nové heslá.",
            fill="#FFF3F3",
            stroke="#E63946",
        )
    )
    story.append(
        bullet(
            [
                "Neposielajte interné heslá zákazníkom ani na sociálne siete.",
                "Ak sa mení personál, zvážte výmenu hesiel.",
                "Objednávky obsahujú osobné údaje zákazníkov, preto ich používajte iba na vybavenie objednávky.",
                "Pri probléme s databázou alebo webom si poznačte čas, číslo objednávky a čo presne sa stalo.",
                "Supabase databáza má aktuálne importované dáta a web je napojený na produkčný projekt Dragonstreet.",
            ]
        )
    )

    story += section("11. Krátky denný checklist")
    story.append(
        table(
            [
                ["Kedy", "Kontrola"],
                ["Pred otvorením", "Otvorte web, skontrolujte menu, prihláste sa do Admin/Kuchyňa/Kuriér panelu."],
                ["Počas smeny", "Sledujte nové objednávky, nastavujte stavy a riešte problémové objednávky hneď."],
                ["Pred koncom", "Dokončite otvorené objednávky, vypnite dostupnosť kuriérov a skontrolujte, či nezostala objednávka v stave Problém."],
                ["Pri zmene menu", "Upravte cenu/dostupnosť v admin paneli a skontrolujte verejné Menu."],
            ],
            [3.6 * cm, 13.4 * cm],
        )
    )

    story.append(Spacer(1, 10))
    story.append(p("Koniec príručky.", "Small"))
    return story


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT_FILE),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Dragon Street Food Hlohovec - používateľská príručka",
        author="Codex",
        subject="Používateľská príručka k webu Dragon Street Food",
    )
    story = build_story()
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()
