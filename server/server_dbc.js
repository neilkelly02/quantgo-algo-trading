exports.SERVER_DBC = {
    //must be in ascending order
    VALID_INTERVALS : ['1min', '5min', '15min', '30min', '45min', '1h', '2h', '4h', '1day', '1week', '1month'],
    VALID_DATE : new RegExp('(20[0-2][0-9])-([0-1][0-9])-([0-1][0-9])'),
    VALID_DATE_TIME : new RegExp('(20[0-2][0-9])-([0-1][0-9])-([0-1][0-9]) ([0-2][0-9]:[0-6][0-9]:[0-6][0-9])')
};

