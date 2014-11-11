package com.yzw.test;

import java.util.ArrayList;
import java.util.List;

public class StrCvt2Para {

	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		String str1 = "我们sss我是大法师打发；了时间ss发动了多少ss等级分类数据第三方撒旦法分类是sssssss对方飞是否收费多少ssssssssssssssttfff是";
		List rsList = TmpStringTool.StrCvt2Para(str1, 30);
		for (int i = 0; i < rsList.size(); i++) {
			System.out.println(i + 1 + ": " + rsList.get(i));
		}
	}

}

class TmpStringTool {
	/**
	 * 字符串转换成段落（String　convert to paragraph）
	 * @param str 要转换的字符串
	 * @param cpl 每行字数（Char per line）[一个汉子为２个字节]
	 * @return String数组
	 * @throws Exception
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static List StrCvt2Para(String str, int cpl) throws Exception {
		List rsList = new ArrayList();
		for (int i = 0; i < 10; i++) {
			try {
				String t = bSubstring(str, cpl);
				rsList.add(t);
				str = str.substring(t.length());
			} catch (Exception e) {
				// TODO: handle exception
				break;
			}
		}
		return rsList;
	}

	/**
	 * 按字节长度截取字符串
	 * @param s 要截取的字符串
	 * @param length 要截取字符串的长度->是字节一个汉字2个字节 return 返回length长度的字符串（含汉字）
	 */
	private static String bSubstring(String s, int length) throws Exception {
		byte[] bytes = s.getBytes("Unicode");
		int n = 0; // 表示当前的字节数
		int i = 2; // 要截取的字节数，从第3个字节开始
		for (; i < bytes.length && n < length; i++) {
			// 奇数位置，如3、5、7等，为UCS2编码中两个字节的第二个字节
			if (i % 2 == 1) {
				n++; // 在UCS2第二个字节时n加1
			} else {
				// 当UCS2编码的第一个字节不等于0时，该UCS2字符为汉字，一个汉字算两个字节
				if (bytes[i] != 0) {
					n++;
				}
			}
		}
		// 如果i为奇数时，处理成偶数
		if (i % 2 == 1) {
			// 该UCS2字符是汉字时，去掉这个截一半的汉字
			if (bytes[i - 1] != 0)
				i = i - 1;
			// 该UCS2字符是字母或数字，则保留该字符
			else
				i = i + 1;
		}
		// 将截一半的汉字要保留
		if (i % 2 == 1) {
			i = i + 1;
		}
		return new String(bytes, 0, i, "Unicode");
	}
}
