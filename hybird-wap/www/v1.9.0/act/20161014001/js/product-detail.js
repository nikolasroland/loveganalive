		window.onload = function() {
		    $("#return").attr("href", "product.html" + window.location.search);
		}


		var productCount = $('#number').val();
		var p = parseFloat($('.mony').html());
		var zongjia = $('#zongjia').val();
		var qs = getQueryStringArgs();
		console.log(qs);
		$('.detail-recommend').val(qs.gName);
		//		console.log(qs.gName);


		// for proreturn
		$('.orderCode').text(qs.orderCode);
		$('.createDate').text(qs.createDate);
		$('.retAmount').text(qs.retAmount);
		// end for proreturn

		$("#number").on("change", function() {
		    productCount = this.value;
		    zongjia = productCount * p;
		    $(".totalMony").text(zongjia);
		})

		$(".reduce").on('click', function() {
		    productCount--;
		    if (productCount <= 1) {
		        productCount = 1;
		    }
		    $('#number').val(productCount);
		    zongjia = productCount * p;
		    $(".totalMony").text(zongjia);
		});
		$(".add").on('click', function() {
		    productCount++;
		    $('#number').val(productCount);
		    zongjia = productCount * p;
		    $(".totalMony").text(zongjia);
		});
		
		
		$('.pay').on('click', function(){
			var insuranceMobile = $(".detail-tel").val(); //手机号
			var insurancePeople = $('.detail-name').val(); //姓名
			var insuranceAddress = $('.detail-address').val(); //收货人地址
			var detail = $('.detail-word').val(); //留言
			if(!/^1[34578]\d{9}$/.test(insuranceMobile) || insuranceMobile == null || insuranceMobile.length == 0){
				alert("请输入正确手机号！")
				return false;
			}else if(insurancePeople== null || insurancePeople.length== 0){
				alert("请输入姓名！");
				return false;				
			}else if(insuranceAddress== null || insuranceAddress.length== 0){
				alert("请输入收货地址！")
				return false;
			}else{
			
				var data = {
					"insurancePeople" : insurancePeople,
					"insuranceAddress" : insuranceAddress,
					"insuranceMobile" : insuranceMobile,
					"productCount" : productCount,
					"detail" : detail,
					"sign" : "133f78fb52e8c7c3609980f9d3fc7d5e",
					"productId": 73,
					"gName" : qs.gName
				}
					$.ajax({
						type:"post",
						url:JAVA_URL+"product/app/buyProductInsurance.htm",
			            data: data,
						success:function(resp){
							resp = JSON.parse(resp)
							if(resp.code == '0'){	
								wxPay(resp.data.orderCode, resp.data.createDate);
							}
						}
					});
			}
		})
		
		function wxPay(orderCode, createDate) {
			console.log(orderCode)
			console.log(createDate)
			var jsonData = {
                    'orderData': {
                        'uI': '',
                        'uN': '',
                        'nN': '',
                        'pR': 'H5',
                        'oC': orderCode,
                        'pF': '00'
                    },
                    'tenpayData': {
                        'body': '美源康富ABD活性因子',
                        'total_fee': 1,
                        //'total_fee': zongjia * 100,
                        'remoteAddr': '196.168.1.1',
                        'tradeType': 'JSAPI',
                        'openid': qs.openid
                    }
                }
			$.ajax({
				url:JAVA_URL+'trade/app/prepayIdHfiveOnline.htm',
				sign: '425c0e434464a3806c8b78b9fe386d5b',
				dataType:'POST',
				data: JSON.stringify(jsonData),
				success:function(resp){
					wx.config({
					    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					    appId: APP_ID, // 必填，公众号的唯一标识
					    timestamp: Date.now().toString().substr(0, 10), // 必填，生成签名的时间戳
					    nonceStr: resp.xml.nonce_str[0], // 必填，生成签名的随机串
					    signature: resp.xml.sign[0],// 必填，签名，见附录1
					    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					
					wx.ready(function() {
						wx.chooseWXPay({
						    timestamp: resp.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						    nonceStr: resp.nonceStr, // 支付签名随机串，不长于 32 位
						    package: resp.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						    paySign: resp.signHfive, // 支付签名
						    success: function (res) {
						        alert('购买成功')
						        window.location.href = "proReturn.html?orderCode=" + orderCode + "&createDate=" + createDate + "&retAmount=" + zongjia;
						    }
						});
					})
				}
			})
		}
		



		$('.pay').on('click', function() {
		    var insuranceMobile = $(".detail-tel").val(); //手机号
		    var insurancePeople = $('.detail-name').val(); //姓名
		    var insuranceAddress = $('.detail-address').val(); //收货人地址
		    var detail = $('.detail-word').val(); //留言
		    if (!/^1[34578]\d{9}$/.test(insuranceMobile) || insuranceMobile == null || insuranceMobile.length == 0) {
		        alert("请输入正确手机号！")
		        return false;
		    } else if (insurancePeople == null || insurancePeople.length == 0) {
		        alert("请输入姓名！");
		        return false;
		    } else if (insuranceAddress == null || insuranceAddress.length == 0) {
		        alert("请输入收货地址！")
		        return false;
		    } else {

		        var data = {
		            "insurancePeople": insurancePeople,
		            "insuranceAddress": insuranceAddress,
		            "insuranceMobile": insuranceMobile,
		            "productCount": productCount,
		            "detail": detail,
		            "sign": "133f78fb52e8c7c3609980f9d3fc7d5e",
		            "productId": 72,
		            "gName": qs.gName
		        }

		        $.ajax({
		            type: "post",
		            url: JAVA_URL + "product/app/buyProductInsurance.htm",
		            data: data,
		            success: function(resp) {
		                resp = JSON.parse(resp)
		                if (resp.code == '0') {
		                    wxPay(resp.data.orderCode, resp.data.createDate, resp.data.uI,  resp.data.uN,  resp.data.nN);
		                }
		            }
		        });
		    }
		})

		function wxPay(orderCode, createDate, uI, uN, nN) {
		    var jsonData = {
		        'orderData': {
		            'uI': uI,
		            'uN': uN,
		            'nN': nN,
		            'pR': 'H5',
		            'oC': orderCode,
		            'pF': '00'
		        },
		        'tenpayData': {
		            'body': '美源康富ABD活性因子',
		            'total_fee': zongjia * 100,
		            'remoteAddr': '196.168.1.1',
		            'tradeType': 'JSAPI',
		            'openid': qs.openid
		        }
		    }
		    $.ajax({
		        url: JAVA_URL + 'trade/app/prepayIdHfiveOnline.htm',
		        method: 'POST',
		        data: {
		            sign: '425c0e434464a3806c8b78b9fe386d5b',
		            jsonData: JSON.stringify(jsonData)
		        },
		        success: function(resp) {
		            resp = JSON.parse(resp)
		            wx.config({
		                // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		                appId: APP_ID, // 必填，公众号的唯一标识
		                timestamp: Date.now().toString().substr(0, 10), // 必填，生成签名的时间戳
		                nonceStr: resp.data.xml.nonce_str[0], // 必填，生成签名的随机串
		                signature: resp.data.xml.sign[0], // 必填，签名，见附录1
		                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		            });

		            wx.ready(function() {
		                wx.chooseWXPay({
		                    timestamp: resp.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		                    nonceStr: resp.data.nonceStr, // 支付签名随机串，不长于 32 位
		                    package: resp.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
		                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		                    paySign: resp.data.signHfive, // 支付签名
		                    success: function(res) {
		                        alert('购买成功')
		                        window.location.href = "proReturn.html?orderCode=" + orderCode + "&createDate=" + createDate + "&retAmount=" + zongjia;
		                    }
		                });
		            })
		        }
		    })
		}
