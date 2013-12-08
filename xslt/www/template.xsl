<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    
    <xsl:template match="/company">
        <h1>
            <xsl:value-of select="title"/>
        </h1>
        <p>
            <xsl:value-of select="description"/>
        </p>
        <ul>
            <xsl:for-each select="./employees/employee">
                <xsl:sort select="name"/>
                <li>Name: <xsl:value-of select="name"/>, Title: <xsl:value-of select="job"/></li>
            </xsl:for-each>
        </ul>
    </xsl:template>

</xsl:stylesheet>