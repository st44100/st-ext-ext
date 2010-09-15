//住所の自動入力フィールド　postarl/zip-***.jsonのデータを任意の場所に持つこと
Ext.form.PostalField = Ext.extend(Ext.form.TextField,{
    //連動するターゲット
    address1:'address1',
    address2:'address2',
    pref:'pref_select',
    parentFormType:'form',
    baseUrl:baseUrl + '/js/postal/zip-{0}.json',
    initComponent:function()
    {
        Ext.applyIf(this,{
            name:'postalfield',
            fieldLabel:'郵便番号',
            listeners:{
                scope:this,
                change:function(field,newVal,oldVal){
                    var formPanel = field.findParentByType(this.parentFormType);
                    if (!formPanel) {return;}
                    var form = formPanel.getForm();
                    if (newVal) {
                        var postal = newVal.replace('-','').trim();
                        
                        console.debug(postal);
                        Ext.Ajax.request({
                            scope:this,
                            url:String.format(this.baseUrl,postal.substring(0,3)),
                            success:function(res,opt){
                                var json = Ext.util.JSON.decode(res.responseText);
                                var data = json[postal];
                                if (!data){return;}
                                
                                var address = {};
                                address[this.pref] = data[0];
                                address[this.address1] = data[1];
                                address[this.address2] = data[2];
                                form.setValues(address);
                                //formPanel.getComponent(this.pref).selectByValue(data[0]);
                            }
                        });
                    }
                }
            }
        });
        Ext.form.PostalField.superclass.initComponent.call(this);
    }
});
Ext.reg('postalfield',Ext.form.PostalField);

//郵便番号セレクト                        
Ext.form.PrefCombo = Ext.extend(Ext.form.ComboBox,{
    addEmptyPref:false,
    initComponent:function()
    {
        var store = new Ext.data.JsonStore({
            data:[
                {prefid:1,prefname:'北海道'},
                {prefid:2,prefname:'青森県'},
                {prefid:3,prefname:'岩手県'},
                {prefid:4,prefname:'宮城県'},
                {prefid:5,prefname:'秋田県'},
                {prefid:6,prefname:'山形県'},
                {prefid:7,prefname:'福島県'},
                {prefid:8,prefname:'茨城県'},
                {prefid:9,prefname:'栃木県'},
                {prefid:10,prefname:'群馬県'},
                {prefid:11,prefname:'埼玉県'},
                {prefid:12,prefname:'千葉県'},
                {prefid:13,prefname:'東京都'},
                {prefid:14,prefname:'神奈川県'},
                {prefid:15,prefname:'新潟県'},
                {prefid:16,prefname:'富山県'},
                {prefid:17,prefname:'石川県'},
                {prefid:18,prefname:'福井県'},
                {prefid:19,prefname:'山梨県'},
                {prefid:20,prefname:'長野県'},
                {prefid:21,prefname:'岐阜県'},
                {prefid:22,prefname:'静岡県'},
                {prefid:23,prefname:'愛知県'},
                {prefid:24,prefname:'三重県'},
                {prefid:25,prefname:'滋賀県'},
                {prefid:26,prefname:'京都府'},
                {prefid:27,prefname:'大阪府'},
                {prefid:28,prefname:'兵庫県'},
                {prefid:29,prefname:'奈良県'},
                {prefid:30,prefname:'和歌山県'},
                {prefid:31,prefname:'鳥取県'},
                {prefid:32,prefname:'島根県'},
                {prefid:33,prefname:'岡山県'},
                {prefid:34,prefname:'広島県'},
                {prefid:35,prefname:'山口県'},
                {prefid:36,prefname:'徳島県'},
                {prefid:37,prefname:'香川県'},
                {prefid:38,prefname:'愛媛県'},
                {prefid:39,prefname:'高知県'},
                {prefid:40,prefname:'福岡県'},
                {prefid:41,prefname:'佐賀県'},
                {prefid:42,prefname:'長崎県'},
                {prefid:43,prefname:'熊本県'},
                {prefid:44,prefname:'大分県'},
                {prefid:45,prefname:'宮崎県'},
                {prefid:46,prefname:'鹿児島県'},
                {prefid:47,prefname:'沖縄県'}
            ],
            fields:['prefid','prefname']
        });

        if(this.addEmptyPref) {
            var recType = store.recordType;
            store.insert(0,new recType( {prefid:0,prefname:' '}));
        }

        Ext.applyIf(this,{
            fieldLabel:'都道府県',
            store:store,
            triggerAction:'all',
            displayField:'prefname',
            valueField:'prefid',
            mode:'local'
        });
        Ext.form.PrefCombo.superclass.initComponent.call(this);
    }
});

Ext.reg('preffield',Ext.form.PrefCombo);

Ext.ExtendWindow = Ext.extend(Ext.Window,{
    xshift:5,
    yshift:5,
    initComponent:function()
    {
        Ext.applyIf(this,{
            modal:true,
            buttonAlign:'center',
            width:700,
            height:500,
            autoScroll:true
        });

        Ext.ExtendWindow.superclass.initComponent.call(this);
    },



    initEvents:function()
    {
        this.on('show',function(win){
            var pos = win.getPosition();
            win.setPosition(pos[0] + this.xshift, pos[1] + this.yshift);
            var bodyHeight = window.innerHeight;//Ext.getBody().getHeight();
            if (bodyHeight < win.getHeight()) {
                win.setHeight(bodyHeight - 20);
            }
            
            var bodyWidth = window.innerWidth;//Ext.getBody().getWidth();
            if (bodyWidth < win.getWidth()) {
                win.setWidth(bodyWidth - 20);
            }

            var xy = win.getPosition();
            if (xy[0] < 0) {
                xy[0] = 0;
            }
            
            if (xy[1] < 0) {
                xy[1] = 5;
            }
            win.setPosition(xy[0], xy[1]);
        }); 
        Ext.ExtendWindow.superclass.initEvents.call(this);
    },


    //ItemIdからWindow内のすべての階層からコンポーネントを探す
    //見つからない、複数見つかる場合はNG    
    findComponent:function(itemId)
    { 
        var items = this.find('itemId',itemId);
        return items.length == 1 ? items[0] : false;
    }
});
Ext.reg('extendwindow',Ext.ExtendWindow);




//Util関係

//県ID←→県名変換関数
Ext.util.PrefConvert = function(val){
    var prefData  = [
        {prefid:1,prefname:'北海道'},
        {prefid:2,prefname:'青森県'},
        {prefid:3,prefname:'岩手県'},
        {prefid:4,prefname:'宮城県'},
        {prefid:5,prefname:'秋田県'},
        {prefid:6,prefname:'山形県'},
        {prefid:7,prefname:'福島県'},
        {prefid:8,prefname:'茨城県'},
        {prefid:9,prefname:'栃木県'},
        {prefid:10,prefname:'群馬県'},
        {prefid:11,prefname:'埼玉県'},
        {prefid:12,prefname:'千葉県'},
        {prefid:13,prefname:'東京都'},
        {prefid:14,prefname:'神奈川県'},
        {prefid:15,prefname:'新潟県'},
        {prefid:16,prefname:'富山県'},
        {prefid:17,prefname:'石川県'},
        {prefid:18,prefname:'福井県'},
        {prefid:19,prefname:'山梨県'},
        {prefid:20,prefname:'長野県'},
        {prefid:21,prefname:'岐阜県'},
        {prefid:22,prefname:'静岡県'},
        {prefid:23,prefname:'愛知県'},
        {prefid:24,prefname:'三重県'},
        {prefid:25,prefname:'滋賀県'},
        {prefid:26,prefname:'京都府'},
        {prefid:27,prefname:'大阪府'},
        {prefid:28,prefname:'兵庫県'},
        {prefid:29,prefname:'奈良県'},
        {prefid:30,prefname:'和歌山県'},
        {prefid:31,prefname:'鳥取県'},
        {prefid:32,prefname:'島根県'},
        {prefid:33,prefname:'岡山県'},
        {prefid:34,prefname:'広島県'},
        {prefid:35,prefname:'山口県'},
        {prefid:36,prefname:'徳島県'},
        {prefid:37,prefname:'香川県'},
        {prefid:38,prefname:'愛媛県'},
        {prefid:39,prefname:'高知県'},
        {prefid:40,prefname:'福岡県'},
        {prefid:41,prefname:'佐賀県'},
        {prefid:42,prefname:'長崎県'},
        {prefid:43,prefname:'熊本県'},
        {prefid:44,prefname:'大分県'},
        {prefid:45,prefname:'宮崎県'},
        {prefid:46,prefname:'鹿児島県'},
        {prefid:47,prefname:'沖縄県'}
    ];
     
    if (parseInt(val)){
        for (var i in prefData ){
            if (prefData.hasOwnProperty(i)) {
                if (prefData[i].prefid == val) {
                    return prefData[i].prefname;
                }
            }
        }
    }else {
        for (var i in prefData ){
            if (prefData.hasOwnProperty(i)) {
                if (prefData[i].prefname == val) {
                    return prefData[i].prefid;
                }
            }
        }
    }
};

//曜日コンボ
Ext.form.DayWeekField = new Ext.extend(Ext.form.ComboBox,{
    initComponent:function()
    {

        var weekdata = [
            { 'dw_name':'日', 'dw_id' :0 },
            { 'dw_name':'月', 'dw_id' : 1 },
            { 'dw_name':'火', 'dw_id' : 2 },
            { 'dw_name':'水', 'dw_id' : 3 },
            { 'dw_name':'木', 'dw_id' : 4 },
            { 'dw_name':'金', 'dw_id' : 5 },
            { 'dw_name':'土', 'dw_id' : 6 }
        ];

        Ext.apply(this,{
            store:new Ext.data.JsonStore({
                data:weekdata,
                fields:[ 'dw_name','dw_id' ]
            }),
            triggerAction:'all',
            lazyRender:true,
            editable:false,
            mode:'local',
            valueField:'dw_id',
            displayField:'dw_name'
        });
        Ext.form.DayWeekField.superclass.initComponent.call(this);
    }
});
Ext.reg('dayweekfield',Ext.form.DayWeekField);


//西暦コンボ
Ext.form.YearComboField = new Ext.extend(Ext.form.ComboBox,{
    start:2000,
    end:new Date().format('Y'),
    width:80,
    addEmpty:false,
    initComponent:function()
    {
        var dt = new Date();
        
        //end
        if (!this.end) {
            this.end = dt.format('Y');
        }
        
        //start
        if (!this.start) {
            this.start = dt.add(Date.YEAR, -10).format()
        }
        
        //不正な期間
        if (this.end < this.start) {
            this.end = dt.format('Y');
            this.start = dt.add(Date.YEAR, -10).format()
        }
            
        var years = [];
        //空のとき
        if (this.addEmpty) {
            years.push({ year_name:'選択なし', year_val:'' });
        }

        if (this.prepend) {
            years.push(this.prepend);
        }
        
        for (var i = this.end; i >  parseInt(this.start) -1; i--) {
            years.push({ year_name:i, year_val:i });
        }

        Ext.apply(this,{
            store:new Ext.data.JsonStore({
                data:years,
                fields:[ 'year_name','year_val' ]
            }),
            triggerAction:'all',
            lazyRender:true,
            editable:this.editable ? this.editable:false,
            mode:'local',
            valueField:'year_val',
            displayField:'year_name'
        });
        Ext.form.YearComboField.superclass.initComponent.call(this);
    }
});

Ext.reg('yearcombofield',Ext.form.YearComboField);

//月表示コンボボックス 
Ext.form.MonthComboField = new Ext.extend(Ext.form.ComboBox,{
    start:1,
    end:12,
    width:50,
    leftPad:false,//Valueを2桁にする
    initComponent:function()
    {
        var dt = new Date();
        
        //end
        if (!this.end) {
            this.end = 12;
        }
        
        //start
        if (!this.start && this.start !== 0) {
            this.start = 1;
        }
        
        //不正な期間
        if (this.end < this.start) {
            this.start = 1;
            this.end = 12;
        }
            
        var months = [];
        if (this.prepend) {
            months.push(this.prepend);
        }
        
        for (var i = this.start; i < this.end +1; i++ ){
            months.push({ month_name:i, month_val:this.leftPad ? String.leftPad(i,2,'0') : i });
        }

        Ext.apply(this,{
            store:new Ext.data.JsonStore({
                data:months,
                fields:[ 'month_name','month_val' ]
            }),
            triggerAction:'all',
            lazyRender:true,
            editable:this.editable ? this.editable:false,
            mode:'local',
            valueField:'month_val',
            displayField:'month_name'
        });
        Ext.form.MonthComboField.superclass.initComponent.call(this);
    }
});
Ext.reg('monthcombofield',Ext.form.MonthComboField);

/**
 * 日付用コンボ
 * 開始日:start,終了日：end,月:month,年:year
 * で日にちを生成。閏年の計算も行う
 */
Ext.form.DateComboField = new Ext.extend(Ext.form.ComboBox,{
    start:1,
    end:31,
    month:1,
    year:2012,//閏年チェック用 2012年は閏年
    width:50,
    leftPad:false,//Valueを2桁にする
    initComponent:function()
    {
        var dt = new Date();
        var daysOfMonth = 31;
        //日付の計算
        if (this.year) {
            //閏年用の対処
            dt.setYear(this.year);
        }
        if (this.month) {
            dt.setMonth(this.month);
            //一日に移動
            dt.setDate(1);
            daysOfMonth = dt.getDaysInMonth();
        }
        
        //end
        if (!this.end) {
            this.end = daysOfMonth;
        }
        
        //start
        if (!this.start && this.start !== 0) {
            this.start = 1;
        }
        
        //不正な期間
        if (this.end < this.start) {
            this.start = 1;
            this.end = daysOfMonth;
        }
            
        var days = [];
        if (this.prepend) {
            days.push(this.prepend);
        }
        
        for (var i = this.start; i < this.end +1; i++ ){
            days.push({ date_name:i, date_val:this.leftPad ? String.leftPad(i,2,'0') : i });
        }
        
        Ext.apply(this,{
            store:new Ext.data.JsonStore({
                data:days,
                fields:[ 'date_name','date_val' ]
            }),
            triggerAction:'all',
            lazyRender:true,
            editable:this.editable ? this.editable:false,
            mode:'local',
            valueField:'date_val',
            displayField:'date_name'
        });
        Ext.form.DateComboField.superclass.initComponent.call(this);
    },
    
    setRange:function(m,y)
    {
        
        var dt = new Date();
        var daysOfMonth = this.end;
        //日付の計算
        if (y) {
            //閏年用の対処
            dt.setYear(y);
        }

        if (m) {
            dt.setMonth(parseInt(m) - 1);
            //一日に移動
            dt.setDate(1);
            daysOfMonth = dt.getDaysInMonth();
        }
         
        //end
        var end;
        if (daysOfMonth > this.end) {
            end = this.end;
        }else {
            end = daysOfMonth;
        
        }
        
        //start
        var start;
        if (!this.start && this.start !== 0) {
            start = 1;
        }else {
            start = this.start;
        }
        
        //不正な期間
        if (end < start) {
            start = 1;
            end = daysOfMonth;
        }
            
        var days = [];
        if (this.prepend) {
            days.push(this.prepend);
        }
        
        for (var i = start; i < end +1; i++ ){
            days.push({ date_name:i, date_val:this.leftPad ? String.leftPad(i,2,'0') : i });
        }
        this.getStore().loadData(days);
    }
});
Ext.reg('daycombofield',Ext.form.DateComboField);

//Vtypes:カスタムのvtypeを登録してお0く
// Add the additional 'advanced' VTypes
Ext.apply(Ext.form.VTypes, {
    //日付範囲
    daterange : function(val, field) {
        //Ext.getCmpを廃止して、パネル間で依存しないように修正
        var date = field.parseDate(val);
        if(!date){
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            //var start = field.ownerCt.getForm().findField(field.startDateField);
            var start = field.findParentByType('form').getForm().findField(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        } 
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            //var end = field.ownerCt.getForm().findField(field.endDateField);
            var end = field.findParentByType('form').getForm().findField(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },
    daterangeText:'日付の形式が間違っています。例.2010-01-01',
    daterangeMask:/[0-9\-]/i,

    //西暦
    year :function(val, field){
        if (val.length != 4) {return false;}
        var today = new Date();
        
        if (1927 < val && val < today.format('Y')) {
            return true; 
        }
        return false;
    },
    yearText:'西暦（4桁,1927~' + (function(){ var dt=new Date(); return dt.format('Y');}()) + '）で入力してください',
    yearMask: /[\d\.]/i,
    
    //月
    month :function(val, field){
        if (0 < val && val < 13) {
            return true;
        }
        return false
    },
    monthText:'月は数字(1～12)で入力してください。',
    monthMask: /[\d\.]/i,

    //日
    day :function(val, field){
        if (0 < val && val < 32) {
            return true;
        }
        return false
    },
    dayText:'日付は数字(1～31)で入力してください',
    dayMask: /[\d\.]/i,

    //電話番号ベータ　ハイフン吸収
    phone:  function(v) {
        v = v.replace(/-/g,'');
        if (v.length > 11) {return false;}
        return /[0-9]/.test(v);
    },
    phoneText: '電話番号が間違っています。',
    phoneMask: /[\d-]/i,
    
    //郵便番号ハイフン吸収
    postal:  function(v) {
        v = v.replace(/-/g,'');
        if (v.length > 7) {return false;}
        return /[0-9]/.test(v);
    },
    postalText: '郵便番号の形式が間違っています。',
    postalMask: /[\d-]/i,
    
    //数字
    numeric:  function(v,field) {
        return /[0-9]/.test(v);
    },
    numericText: '半角数字を入力してください。',
    numericMask: /[0-9]/i,
    
    //数値範囲バリデーション
    numrange:function(v,field) {
        if (!/[0-9]/.test(v)) {
            return false;
        }
        if (field.minValue && ) {
            var minField = field.findParentByType('form').getForm().findField(field.minField);
            if (v < minField.getValue()) {return false};
        } 
        else if (field.maxField) { 
            var maxField = field.findParentByType('form').getForm().findField(field.maxField);
            if (v > maxField.getValue()) {return false};
        }
    },
    numrangeText:'値の範囲が間違っています。',
    numrangeMask:/[0-9]/i

});

