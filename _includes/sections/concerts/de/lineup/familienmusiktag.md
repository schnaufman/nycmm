{% assign first_act = concert.acts | first %}
### Familienmusiktag
#### Datum: {{ first_act.date.format | flatify }}, {{ first_act.date.time.begin }} - {{ first_act.date.time.end }}<br>Ort: {{ first_act.location }}
##### Kostenlose Workshopstationen zum Musikschnuppern und Live-Mitmach-Konzert von 'Brennholz Rocks' für Familien, Kinder & Jugendliche
