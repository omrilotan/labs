#XSLT - XSL Transformations
__Transform XML to HTML__
##Basic Structure
The XSL Processor will find the _template match_ (`<xsl:template match="">`) within the XSL file which will match the root of your XML data structure by tag name, then place the data in respective locations in the output structure.

__XML__
```xml
<company-card>
    <title>Company Name</title>
    <description>Company Description</description>
</company-card>
```
__XSL__
```xml
<xsl:template match="/company-card">
    <h1>
        <xsl:value-of select="title"/>
    </h1>
    <p>
        <xsl:value-of select="description"/>
    </p>
</xsl:template>
```
__Output__
```html
<h1>
    Company Name
</h1>
<p>
    Company Description
</p>
```
### Data Members, Slash Notation)
__XSL__
```xml
<xsl:value-of select="company/employees/employee/name"/>
```
### Iteration) xsl:for-each
__XSL__
```xml
<xsl:for-each select="company/employees/employee">
    <li>Name: <xsl:value-of select="name"/>, Title: <xsl:value-of select="job"/></li>
</xsl:for-each>
```
### Filter
__XSL__
```xml
<xsl:for-each select="company/employees/employee[name='bob']">
    <li>Name: <xsl:value-of select="name"/>, Title: <xsl:value-of select="job"/></li>
</xsl:for-each>
```
### Sort) xsl:sort
__XSL__
```xml
<xsl:for-each select="company/employees/employee">
    <xsl:sort select="name"/>
    <li>Name: <xsl:value-of select="name"/>, Title: <xsl:value-of select="job"/></li>
</xsl:for-each>
```
### Conditioning) xsl:if
__XSL__
```xml
<xsl:for-each select="company/employees/employee">
    <xsl:if test="seniority &gt; 3">
        <li>Name: <xsl:value-of select="name"/>, Title: <xsl:value-of select="job"/></li>
    </xsl:if>
</xsl:for-each>
```
### Switch) xsl:choose
__XSL__
```xml
<xsl:for-each select="company/employees/employee">
    <xsl:choose>
        <xsl:when test="seniority &gt; 10">
            <li bgcolor="#999">
                <xsl:value-of select="name"/>
            </li>
        </xsl:when>
        <xsl:when test="seniority &gt; 5">
            <li bgcolor="#ccc">
                <xsl:value-of select="name"/>
            </li>
        </xsl:when>
        <xsl:otherwise>
            <li>
                <xsl:value-of select="name"/>
            </li>
        </xsl:otherwise>
    </xsl:choose>
</xsl:for-each>
```
### Include) xsl:apply-templates
For the same example from above:

__XSL__
```xml
<xsl:template match="/company-card">
    <h1>
        <xsl:value-of select="title"/>
    </h1>
    <xsl:apply-templates select="description"/>
</xsl:template>

<xsl:template match="description">
    <p>
        <xsl:value-of select="."/>
    </p>
</xsl:template>
```

## XPath and XQuery