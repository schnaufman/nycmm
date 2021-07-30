<div class="grid-x grid-padding-x grid-padding-y large-up-{{2}} medium-up-{{2}} small-up-1">
    {% for program in section.programs %}
        <div class="cell">
            {% capture program_description %}{% include sections/{{ page.section }}/{{ page.language }}/{{ section.folder }}/{{ program.description }} %}{% endcapture %}
            {{ program_description | markdownify }}
        </div>
    {% endfor %}
</div>