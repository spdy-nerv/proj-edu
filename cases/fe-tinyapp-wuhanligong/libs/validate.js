var validate = {
        /**
         * @description 邮箱规则验证
         * @param {Object} str 邮箱
         * @return  boolean
         */
        email : function(str){
            var regEmail = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            return regEmail.test(str);
        },
        
        /**
         * @description 手机规则验证
         * @param {Object} str
         * @return  boolean
         */
        phone : function(str) {
            var regPhone = /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/;
            return regPhone.test(str);
        }
 }       

module.exports = {
    validate: validate
};