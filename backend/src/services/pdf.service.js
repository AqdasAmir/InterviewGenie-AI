const pdfmake = require("pdfmake")

const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

pdfmake.addFonts(fonts)

function buildResumeDocDefinition(data) {
    const contactLine = [data.contact?.email, data.contact?.phone, data.contact?.location, data.contact?.linkedin, data.contact?.github]
        .filter(Boolean).join("   |   ")

    const content = [
        { text: data.name, style: "name" },
        { text: data.headline, style: "headline" },
        { text: contactLine, style: "contact" },

        { text: "Summary", style: "sectionHeader" },
        { text: data.summary, margin: [0, 0, 0, 10] },

        { text: "Skills", style: "sectionHeader" },
        { text: data.skills.join("   •   "), margin: [0, 0, 0, 10] },
    ]

    if (data.experience?.length) {
        content.push({ text: "Experience", style: "sectionHeader" })
        data.experience.forEach(exp => {
            content.push(
                {
                    text: [
                        { text: `${exp.role} — ${exp.company}`, bold: true },
                        { text: `    ${exp.duration}`, italics: true, color: "#666666", fontSize: 9 }
                    ]
                },
                { ul: exp.bullets, margin: [0, 2, 0, 10] }
            )
        })
    }

    if (data.projects?.length) {
        content.push({ text: "Projects", style: "sectionHeader" })
        data.projects.forEach(proj => {
            const stackLine = proj.techStack?.length ? `   (${proj.techStack.join(", ")})` : ""
            content.push(
                {
                    text: [
                        { text: proj.name, bold: true },
                        { text: stackLine, italics: true, color: "#666666", fontSize: 9 }
                    ]
                },
                { ul: proj.bullets, margin: [0, 2, 0, 10] }
            )
        })
    }

    if (data.education?.length) {
        content.push({ text: "Education", style: "sectionHeader" })
        data.education.forEach(edu => {
            content.push({
                text: [
                    { text: `${edu.degree} — ${edu.institution}`, bold: true },
                    { text: `    ${edu.duration}`, italics: true, color: "#666666", fontSize: 9 }
                ],
                margin: [0, 0, 0, 6]
            })
        })
    }

    return {
        pageMargins: [40, 40, 40, 40],
        content,
        styles: {
            name: { fontSize: 20, bold: true },
            headline: { fontSize: 12, color: "#444444", margin: [0, 2, 0, 4] },
            contact: { fontSize: 9, color: "#555555", margin: [0, 0, 0, 12] },
            sectionHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 6], decoration: "underline" },
        },
        defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.2 }
    }
}


async function generatePdfBuffer(data) {
    const docDefinition = buildResumeDocDefinition(data)
    const pdf = pdfmake.createPdf(docDefinition)
    const buffer = await pdf.getBuffer()
    return buffer
}

module.exports = { generatePdfBuffer };