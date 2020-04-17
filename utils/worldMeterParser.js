exports.parseWorldMeterData = ($) => {
    const totalCases = $(".maincounter-number span:first-child").eq(0).text().trim();
    const totalDeaths = $(".maincounter-number span:first-child").eq(1).text().trim();
    const totalRecoveries = $(".maincounter-number span:first-child").eq(2).text().trim();

    const totalActive = $(" .panel-title:contains('Active Cases')").parent().parent().find(".panel_front div:first-child").html()
    const totalActiveMild = $(" .panel-title:contains('Active Cases')").parent().parent().find(".panel_front div:nth-child(3) div:nth-child(1) .number-table").html()
    const totalActiveMildPerc = $(" .panel-title:contains('Active Cases')").parent().parent().find(".panel_front div:nth-child(3) div:nth-child(1) strong").html()
    const totalActiveSevere = $(" .panel-title:contains('Active Cases')").parent().parent().find(".panel_front div:nth-child(3) div:nth-child(2) .number-table").html()
    const totalActiveSeverePerc = $(" .panel-title:contains('Active Cases')").parent().parent().find(".panel_front div:nth-child(3) div:nth-child(2) strong").html()

    const totalClosed = $(".panel-title:contains('Closed Cases')").parent().parent().find('.panel_front div:first-child').html()
    const totalClosedRecoveries = $(".panel-title:contains('Closed Cases')").parent().parent().find('.panel_front div:nth-child(3) div:nth-child(1) .number-table').html()
    const totalClosedRecoveriesPerc = $(".panel-title:contains('Closed Cases')").parent().parent().find('.panel_front div:nth-child(3) div:nth-child(1) strong').html()
    const totalClosedDeaths = $(".panel-title:contains('Closed Cases')").parent().parent().find(".panel_front div:nth-child(3) div:nth-child(2) .number-table").html()
    const totalClosedDeathsPerc = $(".panel-title:contains('Closed Cases')").parent().parent().find(".panel_front div:nth-child(3) div:nth-child(2) strong").html()



    return {
        totalCases: trimIfNotNull(totalCases),
        totalDeaths: trimIfNotNull(totalDeaths),
        totalRecoveries: trimIfNotNull(totalRecoveries),
        "activeCases": {
            totalActive: trimIfNotNull(totalActive),
            totalActiveMild: trimIfNotNull(totalActiveMild),
            totalActiveSevere: trimIfNotNull(totalActiveSevere),
            totalActiveSeverePerc: trimIfNotNull(totalActiveSeverePerc),
            totalActiveMildPerc: trimIfNotNull(totalActiveMildPerc),
        },
        "closedCases": {
            totalClosed: trimIfNotNull(totalClosed),
            totalClosedRecoveries: trimIfNotNull(totalClosedRecoveries),
            totalClosedDeaths: trimIfNotNull(totalClosedDeaths),
            totalClosedRecoveriesPerc: trimIfNotNull(totalClosedRecoveriesPerc),
            totalClosedDeathsPerc: trimIfNotNull(totalClosedDeathsPerc)
        }
    }
}


const trimIfNotNull = (data) => {
    if (data === null) {
        return data;
    } else {
        return data.trim()
    }
}