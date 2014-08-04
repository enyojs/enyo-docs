{% macro typeList(t) %}
	{%- if not t.undocumented -%}
		{% set pipe = joiner(' | ') %}
		{%- for type in t.resolved -%}
			{{ pipe() }}{{ type.link }}
		{%- endfor -%}
	{%- endif -%}
{% endmacro %}

{% macro source(obj) %}
<div class="source">
	<a href="javascript:void(0);" title="">{{ obj.meta.filename }}</a> : {{ obj.meta.lineno }}
</div>		
{% endmacro %}