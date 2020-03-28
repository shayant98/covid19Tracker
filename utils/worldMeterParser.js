exports.parseWorldMeterData = ($) => {
    const totalCases = $(".maincounter-number span:first-child").eq(0).text().trim();
    const totalDeaths = $(".maincounter-number span:first-child").eq(1).text().trim();
    const totalRecoveries = $(".maincounter-number span:first-child").eq(2).text().trim();

    const totalActive = $(".panel_front div:first-child").eq(0).text();
    const totalActiveMild = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(0).text().trim();
    const totalActiveMildPerc = $(".panel_front div:nth-child(3) div:nth-child(1) strong").eq(0).text().trim();
    const totalActiveSevere = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(0).text().trim();
    const totalActiveSeverePerc = $(".panel_front div:nth-child(3) div:nth-child(2) strong").eq(0).text().trim();

    const totalClosed = $(".panel_front .number-table-main").eq(1).text().trim();
    const totalClosedRecoveries = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(1).text().trim();
    const totalClosedRecoveriesPerc = $(".panel_front div:nth-child(3) div:nth-child(1) strong").eq(1).text().trim();
    const totalClosedDeaths = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(1).text().trim();
    const totalClosedDeathsPerc = $(".panel_front div:nth-child(3) div:nth-child(2) strong").eq(1).text().trim();


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
            totalClosedRecoveriesPerc,
            totalClosedDeathsPerc
        },
        "closedCases": {
            totalClosed,
            totalClosedRecoveries,
            totalClosedDeaths
        }
    }
}
