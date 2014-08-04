{% macro typeList(t) %}
	{%- if not t.undocumented -%}
		{% set pipe = joiner(' | ') %}
		{%- for type in t.resolved -%}
			{{ pipe() }}{{ type.link }}
		{%- endfor -%}
	{%- endif -%}
{% endmacro %}