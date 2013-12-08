<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    
    <xsl:template match="/company">
        <h1>
            <xsl:value-of select="title"/>
        </h1>
        <h2>
            <xsl:value-of select="description"/>
        </h2>
        <ul>
            <xsl:apply-templates select="employees"/>
        </ul>
    </xsl:template>

    <xsl:template match="employees">
        <xsl:for-each select="employee[job!='CEO']">
            <xsl:sort select="seniority"
                    data-type="number"
                    order="descending"/>
            <xsl:choose>
                <xsl:when test="seniority &gt; 9">
                    <li>
                        <xsl:attribute name="style">
                            color:<xsl:value-of select="level"/>
                        </xsl:attribute>
                        Name: <b><xsl:value-of select="name"/></b>, Title: <b><xsl:value-of select="job"/></b>
                    </li>
                </xsl:when>
                <xsl:when test="seniority &gt; 5">
                    <li>
                        <xsl:attribute name="style">
                            color:<xsl:value-of select="level"/>
                        </xsl:attribute>
                        Name: <u><xsl:value-of select="name"/></u>, Title: <u><xsl:value-of select="job"/></u>
                    </li>
                </xsl:when>
                <xsl:otherwise>
                    <li>
                        <xsl:attribute name="style">
                            color:<xsl:value-of select="level"/>
                        </xsl:attribute>
                        Name: <i><xsl:value-of select="name"/></i>, Title: <i><xsl:value-of select="job"/></i>
                    </li>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>