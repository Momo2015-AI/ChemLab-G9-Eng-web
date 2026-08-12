/* Lesson 02 — reviewed production question bank v1
 * Original content. Not derived from the retired 320-question dataset.
 */
export const lesson02Questions = [
 {id:'L02-P01',node:'KN-02-01',target:'AT-02-01',type:'choice',prompt:'科学探究中，最适合用来记录实验过程中直接观察到的现象的是哪一项？',options:['“产生了新物质”','“溶液由无色变为黄色”','“反应一定很快”','“该物质性质活泼”'],answer:1,misconception:'M02-observation-inference',explanation:'颜色变化是直接观察到的现象；“产生了新物质”等属于解释或结论。'},
 {id:'L02-P02',node:'KN-02-01',target:'AT-02-01',type:'choice',prompt:'进行实验探究时，第一步更合理的做法是什么？',options:['先写结论','明确问题并提出可检验的问题或假设','先修改实验数据','先选择最复杂的仪器'],answer:1,misconception:'M02-process-order',explanation:'探究应从明确问题开始，再形成可检验的假设和方案。'},
 {id:'L02-P03',node:'KN-02-02',target:'AT-02-02',type:'choice',prompt:'观察到蜡烛燃烧产生火焰。下列说法中属于“观察”而不是“解释”的是：',options:['生成了二氧化碳','蜡烛发生了化学反应','火焰呈黄色','石蜡蒸气被点燃'],answer:2,misconception:'M02-observation-inference',explanation:'火焰颜色可直接观察；其他说法需要根据证据进行解释。'},
 {id:'L02-P04',node:'KN-02-02',target:'AT-02-02',type:'choice',prompt:'实验中记录“瓶壁出现水雾”，最恰当的记录方式是：',options:['水雾证明一定生成水','瓶壁出现水雾','发生了化学反应','反应物全部转化'],answer:1,misconception:'M02-observation-inference',explanation:'先客观记录现象，再结合其他证据作解释。'},
 {id:'L02-P05',node:'KN-02-03',target:'AT-02-03',type:'choice',prompt:'比较两种条件对某现象的影响时，哪种方案更公平？',options:['同时改变两个条件','只改变研究的条件，其余主要条件保持一致','两组使用不同仪器','只记录结果较好的一组'],answer:1,misconception:'M02-control-variable',explanation:'公平比较要求控制无关变量，只改变研究变量。'},
 {id:'L02-P06',node:'KN-02-03',target:'AT-02-03',type:'choice',prompt:'若研究温度对溶解快慢的影响，最需要保持一致的是：',options:['温度和水量都不同','水的体积、溶质质量等主要条件一致，只改变温度','两组观察时间不同','一组搅拌、一组不搅拌'],answer:1,misconception:'M02-control-variable',explanation:'研究温度时，应尽量保持其他主要条件一致。'},
 {id:'L02-P07',node:'KN-02-04',target:'AT-02-04',type:'choice',prompt:'实验结果与原来的预测不一致时，最科学的做法是：',options:['修改记录使其符合预测','直接宣布假设错误且无需检查','保留真实记录，检查条件和操作并复核实验','只选择支持预测的数据'],answer:2,misconception:'M02-data-integrity',explanation:'真实数据必须保留；异常结果应通过检查、重复或改进方案来解释。'},
 {id:'L02-P08',node:'KN-02-04',target:'AT-02-04',type:'choice',prompt:'哪项最能体现“证据支持结论”？',options:['先有结论再挑现象','观察到的数据与结论之间有明确的逻辑联系','同学都认为结论正确','实验做得越复杂结论越可靠'],answer:1,misconception:'M02-evidence-logic',explanation:'结论应建立在相关、可检查的证据之上。'},
 {id:'L02-P09',node:'KN-02-05',target:'AT-02-04',type:'choice',prompt:'实验记录只有“结论正确”一句话，没有观察和数据。主要缺陷是：',options:['字数太少','缺少支撑结论的原始证据','仪器一定错误','结论一定错误'],answer:1,misconception:'M02-evidence-record',explanation:'缺少原始观察或数据，就无法充分检查结论是否有证据支持。'},
 {id:'L02-P10',node:'KN-02-05',target:'AT-02-02',type:'choice',prompt:'实验报告中“观察到什么”和“由此说明什么”分开记录的主要意义是：',options:['让报告更长','区分证据与解释，减少把推断当成现象','保证每次都得到预期结果','避免重复实验'],answer:1,misconception:'M02-observation-inference',explanation:'分开记录有助于保持证据边界和推理透明。'},
 {id:'L02-P11',node:'KN-02-01',target:'AT-02-01',type:'choice',prompt:'下列哪项最符合科学探究的特点？',options:['只接受与预期一致的结果','允许根据证据修正原来的解释','实验结论不能改变','实验记录可以事后调整'],answer:1,misconception:'M02-scientific-attitude',explanation:'科学探究强调证据、复核和根据新证据修正解释。'},
 {id:'L02-P12',node:'KN-02-02',target:'AT-02-02',type:'constructed',prompt:'请说明为什么实验记录中应先写“观察到的现象”，再写“根据现象得到的解释”。',rubric:'指出两者性质不同；说明现象是直接证据，解释是基于证据的推断；避免把推断写成观察。',misconception:'M02-observation-inference'},
 {id:'L02-P13',node:'KN-02-03',target:'AT-02-03',type:'constructed',prompt:'设计一个简单的公平比较方案，研究“搅拌是否影响某固体在水中的溶解快慢”。写出应控制的主要条件。',rubric:'明确只改变是否搅拌；保持水量、固体质量/规格、温度等主要条件一致，并采用一致的观察指标。',misconception:'M02-control-variable'},
 {id:'L02-P14',node:'KN-02-04',target:'AT-02-04',type:'choice',prompt:'重复实验的一个重要作用是：',options:['保证每次结果完全相同','检查结果是否稳定并发现偶然因素','把异常数据删除','让结论一定正确'],answer:1,misconception:'M02-repeat-purpose',explanation:'重复可帮助判断结果稳定性并识别偶然误差，但不能保证结论一定正确。'},
 {id:'L02-P15',node:'KN-02-05',target:'AT-02-04',type:'choice',prompt:'同一实验得到两组不同结果，首先应关注：',options:['哪组更符合课本答案','两组实验条件、操作和记录是否一致','直接取平均并删除原数据','选择自己喜欢的结果'],answer:1,misconception:'M02-data-review',explanation:'应先检查条件、操作和记录，再决定如何进一步复核。'},
 {id:'L02-P16',node:'KN-02-01',target:'AT-02-01',type:'choice',prompt:'“提出问题—作出假设—设计实验—获得证据—解释结论—交流反思”体现的是：',options:['机械记忆过程','科学探究的基本思路','化学方程式书写规则','仪器使用顺序'],answer:1,misconception:'M02-process-order',explanation:'这些环节构成科学探究的基本思路。'},
 {id:'L02-P17',node:'KN-02-02',target:'AT-02-02',type:'choice',prompt:'“固体逐渐减少”属于哪一类信息？',options:['直接观察到的现象','最终科学结论','未经检验的假设','实验目的'],answer:0,misconception:'M02-observation-inference',explanation:'固体量的可见变化属于观察记录。'},
 {id:'L02-P18',node:'KN-02-03',target:'AT-02-03',type:'choice',prompt:'为了比较两种物质在水中的溶解快慢，哪项做法会明显削弱公平性？',options:['使用相同水量','使用相同温度','一组持续搅拌而另一组不搅拌','采用相同的判断标准'],answer:2,misconception:'M02-control-variable',explanation:'搅拌会成为额外变量，影响比较结果。'},
 {id:'L02-P19',node:'KN-02-04',target:'AT-02-04',type:'choice',prompt:'如果结果不支持假设，下列哪种表述最科学？',options:['实验失败，所以数据无效','结果与假设不一致，需要检查并进一步研究','把数据改成支持假设','假设一定正确，只是仪器有问题'],answer:1,misconception:'M02-data-integrity',explanation:'不支持假设本身也是有价值的证据，应进一步检查和研究。'},
 {id:'L02-P20',node:'KN-02-05',target:'AT-02-02',type:'choice',prompt:'一份高质量实验记录最重要的特点之一是：',options:['只写结论','只写自己认为重要的内容','让别人能够根据记录了解关键条件、观察和证据','尽量使用复杂术语'],answer:2,misconception:'M02-evidence-record',explanation:'完整、客观的记录使实验过程和证据可检查、可交流。'}
];
export default lesson02Questions;
