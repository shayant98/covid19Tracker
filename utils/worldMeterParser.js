exports.parseWorldMeterData = ($) => {
    const totalCases = $(".maincounter-number span:first-child").eq(0).text().trim();
    const totalDeaths = $(".maincounter-number span:first-child").eq(1).text().trim();
    const totalRecoveries = $(".maincounter-number span:first-child").eq(2).text().trim();

    const totalActive = $(" div:contains('Active Cases') .panel_front div:first-child").eq(0).text();
    const totalActiveMild = $(" div:contains('Active Cases') .panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(0).text().trim();
    const totalActiveMildPerc = $(" div:contains('Active Cases') .panel_front div:nth-child(3) div:nth-child(1) strong").eq(0).text().trim();
    const totalActiveSevere = $(" div:contains('Active Cases') .panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(0).text().trim();
    const totalActiveSeverePerc = $(" div:contains('Active Cases') .panel_front div:nth-child(3) div:nth-child(2) strong").eq(0).text().trim();

    const totalClosed = $("div:contains('Closed Cases') .panel_front .number-table-main").eq(0).text().trim();
    const totalClosedRecoveries = $("div:contains('Closed Cases')  .panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(0).text().trim();
    const totalClosedRecoveriesPerc = $("div:contains('Closed Cases')  .panel_front div:nth-child(3) div:nth-child(1) strong").eq(0).text().trim();
    const totalClosedDeaths = $("div:contains('Closed Cases')  .panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(0).text().trim();
    const totalClosedDeathsPerc = $("div:contains('Closed Cases')  .panel_front div:nth-child(3) div:nth-child(2) strong").eq(0).text().trim();


    return {
        totalCases,
        totalDeaths,
        totalRecoveries,
        "activeCases": {
            totalActive,
            totalActiveMild,
            totalActiveSevere,
            totalActiveSeverePerc,
            totalActiveMildPerc,
        },
        "closedCases": {
            totalClosed,
            totalClosedRecoveries,
            totalClosedDeaths,
            totalClosedRecoveriesPerc,
            totalClosedDeathsPerc
        }
    }
}
