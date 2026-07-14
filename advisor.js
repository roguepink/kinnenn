'use strict';

/* 「今日のアドバイス」生成エンジン（端末内で動作・日英対応）。
   - 断定的な効能表現を避け、「〜と言われています／〜とされています」等の
     一般的な情報紹介の形に統一（医療機器・薬機法まわりの誤解を避けるため）
   - 継続日数と年齢を参照する
   - 直近に出したものを避け、同じような内容が続かないようにする
   誕生日＋日付＋salt から決定的に生成するため、同じ日は同じ結果になり、
   「別のアドバイスに切り替え」を押すと別の組み合わせが出る。 */

const ADVISOR_JA = {
  MED: {
    s0: [
      '禁煙を始めた直後は、体内のニコチン濃度が少しずつ下がり始めると言われています。こまめな水分補給で体をいたわりましょう。',
      'タバコをやめた直後は、口寂しさを感じやすい時期です。ガムや飴を代わりに試してみると、気がまぎれることがあります。',
      'もし強いイライラ・動悸・手の震えなどがあれば、我慢せず禁煙外来や医療機関に相談してください。ニコチン依存が強い方は、医師のサポートがあるとより続けやすい場合があります。',
      '「やめよう」と決めたその決断自体が、すでに大きな一歩です。今日はまず、いつもよりゆっくり深呼吸をしてみるのもおすすめです。',
    ],
    s1: [
      '禁煙から24〜48時間は、一般的にニコチン離脱症状が出やすい時期とされています。イライラや集中力の低下を感じても、それは体が回復しているサインだと言われています。',
      'この時期は血液中の一酸化炭素濃度が下がり、酸素が体に届きやすくなっていくと言われています。深呼吸を意識すると気分が落ち着きやすくなることがあります。',
      '頭痛・イライラ・強い渇望は、脳がニコチンのない状態に慣れていく一時的な反応であることが多いとされています。強い症状が続くときは医師へ相談を。',
      'この時期に強い不安や集中できなさが続く場合は無理をせず、休める環境を整えることを優先してください。',
    ],
    s2: [
      '離脱症状のピークを越える頃だと言われています。体内のニコチンはほぼ抜け、味覚や嗅覚が少しずつ敏感になり始める人が多いようです。',
      '血行が少しずつ良くなり始め、手足の冷えが和らいでくると感じる人もいます。',
      '睡眠リズムが乱れやすい数日です。日中に軽い運動や日光を取り入れると、体内時計が整いやすくなると言われています。',
      '食欲や味覚の変化に気づく頃です。いつもの食事が少し違って感じられるかもしれません。',
    ],
    s3: [
      '1週間の禁煙で睡眠が深まり、朝の目覚めの良さを感じ始める人が多いようです。就寝前のカフェインを控えると、さらに安定しやすくなります。',
      '血流が改善し始め、運動時の息切れが少しずつ和らいでくると言われています。軽いウォーキングから試してみましょう。',
      '肌の血色が良くなってきたと感じる人がいる頃です。鏡を見るのが少し楽しみになるかもしれません。',
      '「1週間できた」という事実そのものが、今後続けていく大きな自信になります。ここまでの自分をねぎらってあげてください。',
    ],
    s4: [
      '2週間を超えると、肺の機能や血流がさらに改善してくる人が多いと言われています。階段の上り下りが少し楽になったと感じるかもしれません。',
      '気道の繊毛(せんもう)の働きが少しずつ回復し始め、咳や痰が一時的に増えることがあると言われていますが、これは肺の掃除機能が戻ってきているサインとされています。',
      '集中力や記憶のクリアさが戻ってきたと感じる人が多い頃です。新しい習慣や学びを始める好機かもしれません。',
      '味覚や嗅覚がさらに敏感になったと感じる人もいます。食事がいつもよりおいしく感じられるかもしれません。',
    ],
    s5: [
      '1か月の禁煙で、咳・息切れ・喉の違和感が減ってくる人が多いと言われています。健康診断で数値の改善を実感する人もいる時期です。',
      'タバコ代の分、お金や時間に余裕が出てくる人が多いとされています。浮いた分を自分へのごほうびに使うのもおすすめです。',
      '気分の波が穏やかになり、慢性的だったイライラや不安感が減ってきたという声もあります。',
      '「1ヶ月続けられた」という実績は、これから先も大きな支えになります。次の目標を考えてみるのも良いタイミングです。',
    ],
    s6: [
      '2か月を超えると、睡眠と体力の土台が整い、体調を崩しにくくなると言われています。',
      '肺の自浄作用がさらに回復しやすい時期とされています。定期的な健康診断で成果を「見える化」すると、継続の励みになります。',
      '運動や新しい趣味に前向きに取り組める余裕が出てくる人が多い頃です。吸わない時間の使い方を広げてみましょう。',
      '周囲の人から「顔色が良くなった」と言われる人もいる時期です。変化は自分より先に、周りが気づくことがあります。',
    ],
    s7: [
      '3か月は大きな節目です。肺機能や血流の改善が大きく進み、息切れの少なさを実感しやすいと言われています。',
      '脳の報酬系が回復し、タバコへの強い渇望が自然と弱まってくる人が増える頃だとされています。ここまでの継続が土台になっています。',
      '睡眠・食欲・気分のバランスが総合的に整ってきたと感じる人が多い時期です。',
      '「もう吸いたいと思わなくなってきた」という感覚が芽生え始める人もいます。焦らず、この調子を大切にしてください。',
    ],
    s8: [
      '半年の禁煙で、心臓や血管への負担が減り、心血管系のリスクが着実に下がってくると言われています。運動習慣を組み合わせるとさらに良い相乗効果が期待できます。',
      '肺は少しずつ回復していく臓器だとされています。ここまでの継続で、多くの機能が着実に回復に向かっていると考えられます。',
      '人間関係や仕事のパフォーマンスにも良い変化を感じる人が多い時期です。禁煙がもたらす影響は、体だけにとどまらないようです。',
      '半年前の自分と今の自分を比べてみると、想像以上に変わっていることに気づくかもしれません。',
    ],
    s9: [
      '1年以上の禁煙は、心疾患のリスクが喫煙時と比べて大きく下がると報告されています。心から称賛に値する積み重ねです。',
      '長期の禁煙によって、睡眠・気分・人間関係の質までもが総合的に向上したと感じる人が多くいます。',
      'ここまで来ると、禁煙はもう「我慢」ではなく「当たり前の日常」になっている人が多いようです。それ自体が大きな達成です。',
      '長く続けてきたからこそ見える景色があります。ここまでの自分に、あらためて拍手を送ってください。',
    ],
  },
  AGE: {
    young: [
      '若いうちに喫煙習慣を手放すことは、将来の肺や心臓への負担を減らす投資になると言われています。',
      '20代は体の回復力が高い一方で、習慣が定着しやすい時期でもあります。今日の選択が、10年後の自分につながっていきます。',
      '若い世代ほど、禁煙による肌や体力の変化を早く実感しやすいという声もあります。',
      '学業や仕事、人間関係が大きく動くこの時期に、タバコに頼らない自分の軸を作れるのは大きな財産です。',
      '同世代には「吸うのが普通」という空気があるかもしれませんが、断らない勇気こそが今のあなたを強くしています。',
      '若いうちからの禁煙は、将来かかる医療費や失う時間を大きく減らす選択でもあると言われています。',
    ],
    a30: [
      '30代は仕事や付き合いで吸う機会が増えがちです。禁煙は睡眠の質と日中の集中力に直結すると言われています。',
      '代謝が少しずつ変わり始める30代。吸わずに浮いた時間とお金を、自分の健康投資に回してみましょう。',
      'キャリアの重要な時期でもある30代、タバコに頼らない時間が増えることで判断力や体力が安定しやすくなります。',
      '家庭やパートナーとの時間が増える人も多い時期です。禁煙がもたらす穏やかな時間を、大切な人と過ごしてみてください。',
      '30代からの禁煙は、40代以降の健康診断の数値に良い影響を与えやすいとされています。',
      '「そろそろ体を大事にしないと」と感じ始める人が多い年代です。その直感を、今日も一歩前に進めましょう。',
    ],
    a40: [
      '40代は肺機能や血圧に変化が出やすい年代だと言われています。禁煙はこれらの数値改善に特に効果を発揮しやすいとされています。',
      '40代の禁煙は、生活習慣病の予防という観点でも価値の大きい選択です。',
      '仕事の責任が増えるこの時期、タバコに頼らない時間の判断力の安定は大きな武器になります。',
      '子どもや家族との時間の質にも、禁煙は良い影響を与えると感じる人が多いようです。',
      '体力の変化を感じ始める人も多い年代ですが、禁煙はその変化を穏やかにする助けになると言われています。',
      'これからの人生の後半戦を見据えて、今日の選択が体への何よりの投資になります。',
    ],
    a50: [
      '50代は肺の回復に少し時間がかかることもありますが、禁煙の効果は着実に表れると言われています。焦らず継続を。',
      '睡眠が乱れやすくなる年代です。ニコチンを断つことで、夜間に目が覚める回数が減る人が多くいます。',
      'この年代からの禁煙でも、血圧や心肺機能に良い変化が出ることは十分期待できると言われています。',
      '定年後や次のライフステージを見据えて、体調を整えておくことの価値がより大きくなる時期です。',
      '長年の習慣を変えるのは簡単ではありません。それでも今日ここまで続けてこられたことは、誇っていいことです。',
      '家族や孫との時間をより元気に過ごすための、今からの積み重ねです。',
    ],
    senior: [
      'シニア世代はタバコの影響を受けやすいと言われており、禁煙は呼吸器の負担軽減や薬との相互作用の面でも安心につながります。',
      '年齢を重ねてからの禁煙でも、呼吸機能・体力・血流の改善が期待できると言われています。無理のない範囲で続けましょう。',
      'これまでの人生経験があるからこそ、禁煙の意味や価値を深く実感できているのではないでしょうか。',
      '服用中の薬がある方は、タバコとの相互作用が減ることで、薬の効果がより安定しやすくなると言われています。',
      '何歳からでも、体は変化に応える力を持っていると言われています。今日の一歩が、その力を後押しします。',
      'これまで積み重ねてきた人生の知恵を、これからの禁煙の日々にも活かしていってください。',
    ],
    unknown: [
      '設定で生年月日を登録すると、あなたの年代に合わせたアドバイスをお届けできます。',
      '年代に合った助言のために、よければ設定から生年月日を入力してみてください。',
      '生年月日は占いにも使われます。入力すると、より個人に合わせた内容が楽しめます。',
      '生年月日の入力は任意です。空欄のままでも、今日のアドバイスは引き続きお届けします。',
    ],
  },
  TRIVIA: [
    'タバコは「気分が落ち着く」と思われがちですが、実はニコチン切れによるイライラが一時的に収まっているだけだと言われています。',
    'タバコ1箱(20本)には数百円のコストがかかるとされ、1年間の禁煙で数万円単位の節約になることもあると言われています。',
    '「一服」の我慢は、多くの場合15〜20分ほどで吸いたい気持ちの波が引いていくと言われています。',
    '肺は加齢や喫煙の影響を受けやすい臓器ですが、禁煙後は少しずつ自浄作用が回復していくとされています。',
    'ニコチンを分解する速さには個人差があり、遺伝的な要因が影響するという報告もあります。',
    '本数を少しずつ減らすより、きっぱりやめる方が長期的な成功率は高いというデータもあります。',
    '口寂しさを「吸いたい」と勘違いすることがあります。まず水を一杯飲むと、衝動がすっと収まることもあるようです。',
    'ニコチンには血管を収縮させる作用があり、吸うほど手足が冷えやすくなると言われています。',
    '「節煙」より「禁煙」の方が続けやすいと感じる人は少なくないようです。ゼロの方が毎回の判断に迷わないためだと言われています。',
    'ガムやタブレットを「儀式」として置き換えると、手持ち無沙汰からくる吸いたさが和らぐことがあります。',
    '休憩後の一本が山場と言われます。その時間に軽くストレッチを挟むと、吸いたい気持ちが紛れやすくなるようです。',
    'ニコチンには覚醒作用があり、寝つきを悪くすると言われています。禁煙後に眠りが深くなったと感じる人は少なくありません。',
    '日本人の一定数は、ニコチンを分解する酵素の働きに個人差がある体質だと言われています。',
    '禁煙による肌の変化(血色の改善)は、2〜4週間で気づく人が多いようです。',
    '「吸いたい」の多くは、ストレスや退屈が引き金になっていると言われています。別の行動に置き換えると衝動は弱まることがあります。',
    'タバコ1本あたり数十円。1年間の禁煙は、数万円分の節約になることもあると言われています。',
    '「ながら喫煙」の習慣(コーヒーの後・仕事の休憩時など)は、別の行動に置き換えることで手放しやすくなるとされています。',
    '禁煙を始めて数日は「頭がすっきりしない」と感じる人がいますが、これは一時的な適応反応であることが多いようです。',
    '喫煙所での会話の多くは、実は禁煙してからでも十分楽しめると気づく人が少なくないと言われています。',
    'ニコチンは末梢の血流にも影響すると言われ、吸わなくなると手足の冷えが和らいだと感じる人がいるようです。',
    '「1本だけ」のつもりが吸い続けてしまう背景には、最初の一本が「もう1本くらい」という気持ちを緩めてしまう作用があるとされています。',
    '禁煙を続けている人の多くが、数ヶ月後に「以前より肌の調子がいい」と実感すると言われています。',
    'タバコの代わりにガムやハーブティーを選ぶ人が、近年少しずつ増えているようです。',
    '「今日は吸わない日」と決めておくだけで、実際に本数が減りやすいという報告もあります。',
    'ニコチンへの耐性は年齢とともに変化する傾向があり、若い頃と同じ本数でも影響の感じ方が変わることがあると言われています。',
    '禁煙の記録を続けること自体が、達成感を積み重ねて習慣化を助けると言われています。',
  ],
  TIP: [
    '今日は吸いたくなったら、まず冷たい炭酸水を一杯どうぞ。',
    '衝動が来たら5分だけ散歩してみましょう。波はきっと引いていきます。',
    '今日の気分を「記録」タブに残すと、続ける力になります。',
    '手持ち無沙汰なときは、いつもと違うガムやお茶を試してみてください。',
    'ゆっくり深呼吸を3回。それだけで衝動の強さは変わります。',
    '吸いたくなったら、我慢した先にある「明日のスッキリした朝」を想像してみましょう。',
    '手持ち無沙汰なときは、温かい飲み物をゆっくり味わってみて。',
    '今日を達成できたら、タバコ以外の小さなご褒美を自分にあげましょう。',
    '今日は好きな音楽をかけながら、いつもと違う夜を過ごしてみましょう。',
    '吸いたくなったら、その気持ちを紙に書き出してみると、少し落ち着くことがあります。',
    'お気に入りのカフェで、ノンカフェインドリンクを試してみるのもおすすめです。',
    '今日は少し早めにベッドに入って、体をしっかり休めてあげましょう。',
    '誰かに「今日も禁煙できた」と伝えてみると、それが小さな支えになります。',
    '衝動が来たら、冷たい水で手を洗うのも気分を切り替える一つの方法です。',
    '今日の禁煙は、明日のあなたへの一番のプレゼントです。',
    '好きな香りのアロマやお茶で、リラックスできる時間を作ってみてください。',
    '少し体を動かすだけでも、気分が変わることがあります。軽いストレッチはいかがですか。',
    '今日できたことを1つでいいので、自分で自分を褒めてあげましょう。',
  ],
  CLOSING: [
    '一日ずつで大丈夫。あなたはよくやっています。',
    '今日の一歩が、確かな回復につながっています。',
    '無理せず、あなたのペースで。',
    '未来のあなたが、今日の選択にきっと感謝します。',
    'あなたのペースで、今日も進んでいきましょう。',
    '続けているだけで、もう十分にすごいことです。',
    '今日の自分を、誇りに思ってください。',
    '小さな積み重ねが、いつか大きな自信になります。',
    '昨日より少しだけ、今日は軽やかかもしれません。',
    '迷った日があってもいい。それでも続けていることが大切です。',
    'あなたの一歩を、これからも応援しています。',
    '焦らなくて大丈夫。今日という日を、大切に。',
    'その調子です。ゆっくりでいいので、進んでいきましょう。',
    '今日という日は、二度と来ません。大切に過ごしてください。',
    'これからも、一緒に一歩ずつ進んでいきましょう。',
  ],
  head(days, label) {
    if (days <= 0) return label ? `禁煙スタート、${label}のあなたへ。` : '禁煙スタート。よく決心しました。';
    return label ? `禁煙 ${days} 日目、${label}のあなたへ。` : `禁煙 ${days} 日目のあなたへ。`;
  },
  triviaLabel: '💡 豆知識: ',
  ageLabel(age) {
    if (age == null) return null;
    if (age < 20) return '10代';
    if (age < 30) return '20代';
    if (age < 40) return '30代';
    if (age < 50) return '40代';
    if (age < 60) return '50代';
    if (age < 70) return '60代';
    return '70代以上';
  },
};

const ADVISOR_EN = {
  MED: {
    s0: [
      'Right after you quit, your nicotine levels are said to gradually start dropping. Sip water regularly today and be gentle with yourself.',
      'Right after quitting, your mouth and hands may miss the ritual of smoking. Gum or a mint can help fill that gap.',
      'If you get strong irritability, a racing heart or shaking hands, don’t tough it out — a quit-smoking clinic or doctor can help. For heavy smokers, medical support is said to make quitting more sustainable.',
      'The decision to quit is already a big step on its own. Try a few slow, deep breaths today as a small way to look after yourself.',
    ],
    s1: [
      'Withdrawal effects are generally said to peak around 24–48 hours in. Irritability and trouble focusing are usually a sign your body is recovering.',
      'Around this time, carbon monoxide levels in your blood are said to drop, letting more oxygen reach your body. Deep breathing can help you feel steadier.',
      'Headaches, irritability and strong cravings at this stage are usually described as your brain temporarily adjusting to life without nicotine. If symptoms are severe or persist, talk to a doctor.',
      'If strong anxiety or trouble concentrating continues, don’t push through — prioritize rest and a calm environment.',
    ],
    s2: [
      'You’re said to be getting past the peak of withdrawal around now. Nicotine is nearly out of your system, and taste and smell often start sharpening for many people.',
      'Circulation is said to gradually improve, and some people notice their hands and feet feel less cold.',
      'Sleep rhythms can be bumpy for a few days. Light daytime exercise and sunlight are said to help reset your body clock for easier nights.',
      'Appetite and taste may feel different around now. Your usual meals might taste a little different.',
    ],
    s3: [
      'A week in, sleep is said to deepen for many people, with mornings starting to feel genuinely better. Avoiding caffeine before bed may stabilize sleep quality further.',
      'Circulation is said to keep improving, easing shortness of breath during light activity. A short walk is a good way to test it out.',
      'Skin tone often looks a little better for some people around now. The mirror might become a little more fun.',
      'The fact that you made it a full week is real proof you can keep going. Take a moment to acknowledge that.',
    ],
    s4: [
      'Past two weeks, lung function and circulation are said to keep improving for many people. Stairs might start to feel a little easier.',
      'The tiny hairs (cilia) lining your airway are said to gradually regrow, which can temporarily mean more coughing — that’s often described as your lungs’ cleanup system switching back on, not a step backward.',
      'Many people notice sharper focus and clearer memory around now. It could be a good moment to start a new habit or learn something.',
      'Taste and smell can feel more vivid for some people at this stage. Your usual meals might taste noticeably better.',
    ],
    s5: [
      'At one month, coughing, breathlessness and throat irritation are said to ease up for many people. Some notice improving numbers around a checkup at this stage.',
      'Money and time not spent on cigarettes tend to add up quickly for many people at this point. Treating yourself with some of it is a nice way to mark the milestone.',
      'Mood swings tend to smooth out, and many people report less of the chronic irritability and anxiety they used to feel.',
      'Making it a full month is a real achievement that will keep supporting you going forward. It might be a good time to set your next goal.',
    ],
    s6: [
      'Past two months, better sleep and stamina are said to build a stronger foundation, making you less likely to get run down.',
      'Your lungs’ natural cleanup ability is said to keep improving in this period for many people. Regular checkups make the progress visible — great motivation.',
      'Many people find more energy for exercise or new hobbies around now. It’s a good time to expand what you do with your smoke-free hours.',
      'Some people are told by others that they “look healthier” at this stage — change is sometimes noticed by others before yourself.',
    ],
    s7: [
      'Three months is a real milestone. Lung function and circulation are said to be substantially improved for many people, with breathlessness noticeably rarer.',
      'The brain’s reward system is said to be recovering, and strong cravings naturally weaken for many people around now. Your consistency built this.',
      'Sleep, appetite and mood often feel more balanced overall at this stage for many people.',
      'Some people notice they’ve simply stopped wanting a cigarette as much. Take it slow and protect this rhythm.',
    ],
    s8: [
      'Half a year smoke-free is said to reduce strain on the heart and blood vessels, steadily lowering cardiovascular risk for many people. Pairing it with exercise may help even more.',
      'The lungs are described as an organ that keeps recovering gradually over time. With this much consistency, many of their functions are thought to be steadily improving.',
      'Many people notice positive changes in relationships and work performance at this stage — the effects of quitting don’t seem to stop at the body.',
      'Compare who you were six months ago with who you are now — the distance may surprise you.',
    ],
    s9: [
      'Over a year smoke-free is linked in reports to a substantially lower risk of heart disease compared with continued smoking. This is an accomplishment worth genuine pride.',
      'Long-term quitting is often described as improving sleep, mood and even the quality of relationships — the benefits seem to compound.',
      'At this point, for many people staying smoke-free stops feeling like restraint and simply becomes normal life. That shift is itself a major achievement.',
      'There’s a view only visible from this far along the road. Give yourself real credit for reaching it.',
    ],
  },
  AGE: {
    young: [
      'Letting go of smoking while you’re young is said to be a real investment in your future lungs and heart.',
      'Your twenties bring high resilience but also fast habit formation. Today’s choice shapes who you are in ten years.',
      'Younger people are said to notice skin and stamina changes from quitting a little faster than others.',
      'With so much shifting in school, work and relationships right now, building a sense of self that doesn’t rely on cigarettes is a real asset.',
      'Your peers may treat smoking as the default, but the courage to say no is exactly what’s making you stronger today.',
      'Quitting early is also said to reduce the time and money that continued smoking later in life would otherwise cost you.',
    ],
    a30: [
      'Your thirties tend to bring more work breaks and social smoking. Staying smoke-free is said to directly improve sleep and daytime focus.',
      'Metabolism starts shifting in your thirties. Reinvest the time and money you’re not spending on cigarettes into your health.',
      'In this pivotal career decade, not relying on cigarettes tends to make judgment and stamina more stable.',
      'Many people in their thirties gain more time with family or a partner — enjoy the calmer time quitting can bring with the people who matter.',
      'Quitting in your thirties is said to positively influence checkup numbers well into your forties and beyond.',
      'Many people start feeling “it’s time to take care of myself” around this age. Follow that instinct one more day today.',
    ],
    a40: [
      'In your forties, lung function and blood pressure are said to start shifting more easily. Quitting is described as especially effective at improving those numbers.',
      'Quitting in your forties is also a high-value move for preventing lifestyle-related conditions down the road.',
      'With more responsibility at work in this decade, the steadier judgment that comes from not relying on cigarettes is a real advantage.',
      'Many people notice quitting improves the quality of time spent with kids or family.',
      'Physical changes are common at this age, and quitting is said to help ease that transition.',
      'With the second half of life ahead, today’s choice is one of the best investments you can make in your body.',
    ],
    a50: [
      'In your fifties the lungs can take a little longer to recover, but the benefits of quitting are said to arrive reliably. No rush — just keep going.',
      'Sleep gets more fragile at this age. Many people find they wake up far less at night once nicotine is out of the picture.',
      'Even starting from this age, positive changes in blood pressure and lung function are well within reach, based on general reports.',
      'With retirement or a new life stage ahead, keeping your body in good shape carries even more value now.',
      'Changing a long-held habit isn’t easy. Making it this far is genuinely something to be proud of.',
      'This is an investment in having more energy for time with family and grandchildren ahead.',
    ],
    senior: [
      'Older adults are said to feel the effects of smoking more strongly — quitting is also linked to less strain on the lungs and safer medication use.',
      'Even quitting later in life is said to improve breathing, stamina and circulation. Keep it sustainable and steady.',
      'Your life experience likely lets you appreciate the meaning of this choice more deeply than most.',
      'If you take regular medication, fewer interactions with nicotine are said to help those medications work more reliably.',
      'The body is said to retain the capacity to respond to change at any age. Today’s step helps carry that forward.',
      'Bring the wisdom of everything you’ve learned in life into these days of staying smoke-free.',
    ],
    unknown: [
      'Add your birth date in Settings and the advice here will be tailored to your age.',
      'For age-specific guidance, consider entering your birth date in Settings.',
      'Your birth date is also used for the tarot feature — adding it unlocks more personalized content.',
      'Your birth date is optional. Today’s advice keeps working fine even if you leave it blank.',
    ],
  },
  TRIVIA: [
    'Cigarettes seem to calm you down, but that’s often described as simply the temporary relief of an urge nicotine itself created.',
    'A pack of cigarettes carries a real daily cost, and a year smoke-free is said to add up to significant savings for many people.',
    'Ride out a craving and it’s said to usually fade within 15–20 minutes.',
    'The lungs are an organ that’s especially affected by aging and smoking, but their self-cleaning ability is said to gradually recover after quitting.',
    'People vary in how fast they metabolize nicotine, and some reports link certain genetic variants to that difference.',
    'Some data suggests quitting all at once has a higher long-term success rate than gradually cutting down.',
    'Restlessness or a dry mouth is sometimes mistaken for a craving. Drinking a glass of water first is said to sometimes make the urge dissolve.',
    'Nicotine is said to constrict blood vessels, which is part of why smokers’ hands and feet can run cold.',
    'Many people find quitting entirely easier than cutting back, since zero means never having to negotiate with yourself.',
    'Swapping in gum or a mint as a "ritual" is said to ease the restless urge to hold a cigarette.',
    'The moment right after a break is said to be a common trigger point. A short stretch during that time can help the urge pass.',
    'Nicotine is said to be a stimulant that can make it harder to fall asleep — many people notice deeper sleep once they quit.',
    'A meaningful share of people carry a gene variant that affects how quickly they process nicotine.',
    'Skin improvements from quitting are said to typically show within 2–4 weeks.',
    'Most cravings are said to be triggered by stress or boredom. Swapping in another activity is said to reliably weaken the urge.',
    'Even a single cigarette carries a real cost. A year smoke-free is said to add up to significant savings over time.',
    '"Autopilot" smoking (after coffee, during a work break) is said to be easier to drop once it’s replaced with another small ritual.',
    'Feeling mentally foggy for the first few days is common and usually described as a temporary adjustment, not a lasting effect.',
    'Many people are surprised to find they enjoy a smoke break’s social conversation just as much without the cigarette.',
    'Nicotine is said to affect circulation in the extremities — some people notice their hands and feet warming up after they quit.',
    'The slide from "just one" into smoking more is said to happen partly because that first cigarette loosens resolve itself.',
    'Many people who stay smoke-free for a few months report noticeably better skin.',
    'More people are said to be reaching for gum or herbal tea as a substitute in recent years.',
    'Simply deciding in advance "today is a smoke-free day" is linked in some reports to actually smoking less.',
    'Tolerance to nicotine is said to shift with age, so the same number of cigarettes can feel different than it used to.',
    'Keeping a daily log is itself said to reinforce the sense of progress that helps a new habit stick.',
  ],
  TIP: [
    'If a craving hits today, pour yourself a cold sparkling water first.',
    'When the urge comes, walk for just five minutes. The wave will pass.',
    'Logging today’s mood in the Log tab genuinely strengthens the streak.',
    'Restless hands? Try a gum or tea you’ve never had before.',
    'Three slow, deep breaths. That alone changes the strength of an urge.',
    'When you want a cigarette, picture tomorrow’s clear-headed morning — it’s on the other side of today.',
    'Restless hands? Slowly savor a warm drink instead.',
    'If you make it through today, give yourself a small non-cigarette reward.',
    'Put on music you love and let tonight feel a little different.',
    'Writing the craving down on paper can help take some of its weight away.',
    'Try a caffeine-free drink at your favorite café — it might become a new favorite.',
    'Head to bed a little earlier tonight and let your body properly rest.',
    'Telling someone "I made it through today smoke-free" can be a small but real source of support.',
    'Washing your hands with cold water can be a surprisingly effective way to reset a craving.',
    'Today’s smoke-free day is the best gift you can give tomorrow’s you.',
    'Light a favorite-scented candle or brew a calming tea and give yourself a moment to unwind.',
    'Even a little movement can shift your mood — how about a light stretch?',
    'Pick one thing you did today and genuinely give yourself credit for it.',
  ],
  CLOSING: [
    'One day at a time is enough. You’re doing well.',
    'Today’s step is real recovery in motion.',
    'Go at your own pace — no forcing it.',
    'Future you will be grateful for today’s choice.',
    'Keep moving forward today, at whatever pace works for you.',
    'Just by continuing, you’re already doing something remarkable.',
    'Be proud of who you were today.',
    'Small, steady steps eventually become real confidence.',
    'Today might feel a little lighter than yesterday.',
    'It’s okay to have wavering days — what matters is that you keep going.',
    'Your progress is worth cheering for, today and every day.',
    'No need to rush. Just take care of today.',
    'You’re doing great — keep going, gently, at your own speed.',
    'Today will never come again. Make the most of it.',
    'Let’s keep taking it one step at a time, together.',
  ],
  head(days, label) {
    if (days <= 0) return label ? `Starting your smoke-free journey — for you, ${label}.` : 'Day zero. That decision took courage.';
    return label ? `Day ${days} smoke-free — for you, ${label}.` : `Day ${days} smoke-free.`;
  },
  triviaLabel: '💡 Did you know: ',
  ageLabel(age) {
    if (age == null) return null;
    if (age < 20) return 'in your teens';
    if (age < 30) return 'in your 20s';
    if (age < 40) return 'in your 30s';
    if (age < 50) return 'in your 40s';
    if (age < 60) return 'in your 50s';
    if (age < 70) return 'in your 60s';
    return 'in your 70s or beyond';
  },
};

function stageKey(days) {
  if (days <= 0) return 's0';
  if (days <= 2) return 's1';
  if (days <= 6) return 's2';
  if (days <= 13) return 's3';
  if (days <= 29) return 's4';
  if (days <= 59) return 's5';
  if (days <= 89) return 's6';
  if (days <= 179) return 's7';
  if (days <= 364) return 's8';
  return 's9';
}

function ageGroup(age) {
  if (age == null) return 'unknown';
  if (age < 30) return 'young';
  if (age < 40) return 'a30';
  if (age < 50) return 'a40';
  if (age < 60) return 'a50';
  return 'senior';
}

/* 直近に使ったものを避けて選ぶ */
function pick(pool, rand, history, keep) {
  let avail = pool.filter(s => !history.includes(s));
  if (avail.length === 0) avail = pool.slice();
  const s = avail[Math.floor(rand() * avail.length)];
  history.push(s);
  while (history.length > keep) history.shift();
  return s;
}

function ageFrom(birthDate) {
  if (!birthDate) return null;
  const b = new Date(birthDate), t = new Date();
  if (isNaN(b)) return null;
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return (a >= 0 && a < 130) ? a : null;
}

/* history はステップ別の配列を持つオブジェクト（永続化される）。破壊的に更新する。 */
function generate({ days, age, date, salt = 0, history, lang = 'ja' }) {
  const C = lang === 'en' ? ADVISOR_EN : ADVISOR_JA;
  history = history || {};
  for (const k of ['med', 'age', 'trivia', 'tip', 'closing']) if (!history[k]) history[k] = [];

  const rand = Util.rng(Util.hashSeed(`${date}|${salt}|${age == null ? 'x' : age}|${days}`));
  const grp = ageGroup(age);
  const label = C.ageLabel(age);

  /* keepは各プールのサイズより少なめにする（同じ数だと「直近を除外」が
     常に空振りしてフォールバックし続け、実質ただの毎回コインフリップになるため） */
  const med = pick(C.MED[stageKey(days)], rand, history.med, 2);      // 各stageのプールは4件
  const ageNote = pick(C.AGE[grp], rand, history.age, 3);             // 各グループ4〜6件
  const trivia = pick(C.TRIVIA, rand, history.trivia, 12);            // 全26件
  const tip = pick(C.TIP, rand, history.tip, 8);                      // 全18件
  const closing = pick(C.CLOSING, rand, history.closing, 7);          // 全15件

  const text =
    `${C.head(days, label)}\n\n` +
    `🌿 ${med}\n\n` +
    `${ageNote}\n\n` +
    `${C.triviaLabel}${trivia}\n\n` +
    `${tip} ${closing}`;

  return { text };
}

window.Advisor = { generate, ageFrom };
