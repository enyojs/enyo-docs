% Enyo Dos and Don'ts

이 문서는 개발자가 코드 리뷰를 요청하기 전에, 코드 작성 시점에서 고려해야 할 항목들을 설명한다.

이 문서는 각각의 개발자 그룹을 위해 여러 섹션으로 나뉘어져 있으며, 일반적인 개발자를 대상으로 설명을 시작한 후, 공유 코드(shared code)를 작성하는 개발자의 좀 더 구체적인 역할까지 다루게 된다. 우선은 내용을 처음부터 읽어 보고 본인의 업무와 관련된 내용이 아니면 그만 읽는 방법으로 읽어 보기 바란다.


## I'm Developing an Enyo/Moonstone Application...

이 절에서는 Enyo와 Moonstone을 이용한 앱 개발 시, 개발자가 명심해야 하는 사항들을 설명한다.

* **Encapsulation을 깨지 않는다.**

    * 한 라인에서 `$`를 한번 이상 사용하지 않는다.

            this.$.child.$.childsChild    // bad idea

    * 부모의 다른 컴포넌트에 접근하지 않는다.

            this.parent.$.parentsChild    // also a bad idea

    보다 자세한 내용은 [Encapsulation in Enyo](encapsulation-in-enyo.html)를 참고한다.
     
* **대부분의 Published 속성들은 체인지 핸들러(change handlers)나 데이터 바인딩(data bindings)을 가져야 한다.**

    일반적으로 버그는 속성이 create/render 시점에서만 사용되는 경우 발생한다. 런타임 시점에 속성을 변경하게 하는 체인지 핸들러가 없기 때문에, 나중에 누군가가 `set("myProperty", <myValue>)`를 호출해도 아무런 동작도 일어나지 않게 된다.
	
	속성이 create 시점에서 전달되는 것처럼 보이므로 이러한 버그는 잘 발견되지 않는다. 일반적인 패턴은 속성을 사용하는 코드를 체인지 핸들러에 삽입하고 `create()` 시점에서 해당 핸들러를 호출하는 것이다. (핸들러가 이벤트를 보내야 할 때는 `render()` 시점에서 호출한다, 아래참조)


* **`create()`에서 이벤트를 전송하지 않는다. 초기 이벤트(initial event)를 전송해야 하는 경우에는 `render()`에서 전송한다.**

    `create()`에서 이벤트를 보낼 때의 문제점은, 소유자(owner)나 다른 곳에 있는 이벤트 핸들러가 수시로 다른 컴포넌트들을 참조할 필요가 있다는 점이다. `create()`는 항목(items)이 생성되면서 호출된다. 예를 들면, 컴포넌트 A의 `create()` 메소드가 호출된 시점에 컴포넌트 A 다음에 오는 다른 컨포넌트(컴포넌트 B나 C)는 아직 생성되지 않은 상태이다. 그 결과 `this.$.B`를 참조하는 A의 이벤트 핸들러는 undefined 에러를 throw 하게 된다.

	`render()`가 호출될 때는 모든 컴포넌트가 생성된 상태이므로, `render()`에서 초기 이벤트를 발생하도록 하는 것이 더 안전한 방법이다.


* **`onSetupItem`의 이벤트 핸들러는 이벤트의 전달을 멈추기 위해 `true` 값을 반환해야 한다.**
    `True`를 반환하지 않으면, repeater 나 list 를 중첩으로 구성하였을 경우 문제가 발생할 수 있으며, 각 항목에 대해 추가적인 이벤트 전달이 발생하기 때문에 프로그램 실행이 느려진다.


* **불필요한 `Signals` 인스턴스를 생성하지 않는다.**

	하나의 컴포넌트가 여러 개의 다른 시그널을 listen 해야 하더라도 컴포넌트는 `enyo.Signals`중 하나의 인스턴스만 포함하면 된다. 하나의 인스턴스는 여러 개의 시그널을 리스너로 등록할 수 있다. (자세한 내용은 [Event Handling](http://nebula.lgsvl.com/dev-guide/key-concepts/event-handling.html)를 참고한다.)


* **Fittable 사용을 최소화 한다.**

	가능하면 Fittable 대신 CSS를 이용하여 레이아웃을 구성하는 것을 권장한다. CSS 기반의 레이아웃은 `FittableRows`와 `FittableColumns`에서 발생하는 JavaScript 오버헤드를 피할 수 있으므로 더 빠르기 때문이다. 만약 Fittable을 사용해야 한다면, 확장할 row 나 column에 `fit: true`를 반드시 표시한다.


* **`font-face` 값을 직접적으로 설정하지 않는다.**

	라틴어와 non-라틴어는 서로 다른 폰트를 사용한다. 적용된 언어에 따라 프레임워크에서 폰트를 설정해주므로 앱 개발자는 font face를 신경쓰지 않아도 된다.
 
* **Moonstone은 dark theme과 light theme을 모두 가지고 있다.**

	검정 배경에 흰색이나 회색 글자를 사용하는 dart theme이 Moonstone의 기본 설정이다. 회색 배경에 어두운 색 글씨를 사용하는 light theme을 적용하고 싶다면 앱의 `package.js` 파일을 열고 `$lib/moonstone`을 `$lib/moonstone/light-package.js`로 수정한다.

* **공유 경로(Shared Path)를 명시할때는 shortcut을 사용한다.**

	공유 리소스에 대한 경로를 지정해야 하는 경우에는 자주 사용하는 위치를 지정한 shortcut을 참고한다. 아래 예의 `$tv-common`과 같이 프레임워크에서는 자주 사용되는 몇몇 위치의 shortcut을 지원하고 있다.

            this.$.channelSource.setSrc("$tv-common/assets/banner/banner_input_icon_tv.png");

* **right-to-left 호환성을 테스트 한다.**

	컨트롤에 `enyo-locale-right-to-left` CSS 클래스를 설정하면 right-to-left 스크립트를 지원하는 동작들을 활성화 시킬 수 있다.

* **브러우저에서 디버깅한다.**

	JavaScript 앱을 브라우저에서 디버깅 하는 것이 하드웨어에서 디버깅 하는것 보다 훨씬 편리하기 때문에 가능하면 브라우저에서 디버깅하는 것을 권장한다. (자세한 내용은 [Browser-Based Debugging](http://nebula.lgsvl.com/dev-guide/building-apps/testing-and-debugging/browser-based-debugging.html)을 참고한다.)


* **코드를 리팩토링한다.**

	앱 코드를 리팩토링해야 하는 많은 이유가 있지만 Enyo와 Moonstone에서 기억해야 할 점은 리팩토링 한 코드의 최종 파일 사이즈가 더 작고 앱 버전에 최적화 되어 있다는 점이다.


## I'm Creating Custom Widgets for My App...

혼자서 앱을 개발하지 않는 이상, 개발자가 작성한 코드는 일부에서 사용될 가능성이 높다. 이 절에서는 이러한 공유 코드(shared code)를 작성할 때 개발자가 기억해야 할 사항들은 다음과 같다.


* **익숙한 이름을 사용한다.**

    속성 이름을 지정하거나 새로운 API를 정의할 때, 기존에 구현되어있는 소스코드에서 비슷한 속성 또는 API 이름을 찾아서 가능한 같은 이름을 사용하도록 한다. 만약 같은 이름을 사용할 수 없다면, 새로운 이름을 사용하되, 새로운 이름은 일관성을 위해 기존에 사용된 이름과 유사한 형식으로 만들어야 한다. 이와 같이 Enyo의 어휘 복잡성을 제한함으로써, 개발자 입장에서 각 객체가 어떻게 동작하는지 더 정확히 예상할 수 있으며 불필요한 학습 시간을 줄일 수 있다.

* **인라인(inline) API 문서를 포함한다.**

	새로운 kind를 만드는 경우, 소스코드 상단에 kind의 개요, 설명, 간단한 샘플코드를 포함해야 한다. 또한 모든 published 속성, public 이벤트 (이벤트 속성 포함), public 메소드에 대한 인라인 주석을 추가해야 한다.

	추가로  `//* @protected`와 `//* @public pragma`가 올바른 위치에 있는지 확인해야 한다.

	자세한 내용은 [Documenting Code for the API
    Reference](api-reference.html#documenting-code-for-the-api-reference)를 참조한다.

* **모든 CSS 클래스에 개발중인 위젯 이름을 Prefix로 사용한다.**

	모든 CSS 클래스는 개발 중인 위젯 내 범위에서 정의되어야 한다. 그렇지 않으면 CSS 클래스 간 충돌 가능성이 매우 높다. 예를 들어 두 개의 위젯에서 `.button-overlay` 클래스를 정의한다고 가정했을 때, 나중에 정의된 클래스가 먼저 정의된 클래스를 덮어쓸 것이다.

	따라서 `.mywidget-button-overlay`, `.mywidget .button-overlay`와 같이 위젯에 특화된 CSS 클래스를 생성해야 한다.

* **컴포넌트 내 특정 타입의 컨트롤들이 존재할 것이라고 가정하지 않는다.**
	예를 들어, `this.children[0].aFunction("foo");`라고 사용하는 것은 옳지 않다. 특히 decorator 패턴(e.g., InputDecorator)을 사용할 때, 사용자가 Input과 같이 정해진 형태의 객체를 항상 해당 decorator 안에 넣을 것이라고 가정하고 싶을 것이다. 그러나 사용자는 Input과 함께 decorator에 IconButton을 넣는다든가, 또는 decorator 내에 있는 다른 컨트롤 안에 있는 Input을 래핑하는 것을 자유롭게 할 수 있어야 한다.

	개발자가 독창적으로 개발하는데 제한을 두지 말아야 한다. 보통 적절한 이벤트 (bubbling up, waterfalling down) 사용을 통해 앞서 언급한 점들을 해결할 수 있다.

* **kind에 사용자가 삭제하면 안 되는 컨트롤이 포함되어 있는 경우에는 kind 정의에서 컨트롤을 크롬(chrome)으로 생성한다. (예, kind 정의)**

	사용자가 kind를 인스턴스화(instantiate)하고 인스턴스에 새 컨트롤을 추가하기 위해서 `createComponent()`를 호출하면, 필요에 따라 자유롭게 추가하거나 제거할 수 있는 클라이언트 컨트롤이 만들어 진다.

	반면에, 개발자가 개발자의 kind 정의에 컴포넌트를 지정하면, 그 컴포넌트들은 크롬 컨트롤로 만들어 진다 (즉, `isChrome` flag가 true 값을 가진다). 클라이언트 컨트롤과 달리, 크롬 컨트롤은 위젯에 내장되어 있으므로 사용자가 직접 수정할 수 없다. 

	`destroyClientControls()`는 사용자가 내부의 크롬 컨트롤에 영향을 주지 않고 사용자가 추가한 클라이언트 컨트롤을 destroy하는 메소드이다.

	만일 런타임에서 (예, `create()` 에서) 크롬 컨트롤을 동적으로 생성해야 한다면, 다음 중 한가지 방법을 수행한다.
    
    * `createComponent()` 대신 `createChrome()`을 사용하여 컨트롤을 생성한다.
    * `createcomponent()`에 전달하기 전에 각 컨트롤을 `isChrome: true`로 설정한다.
    
	이렇게 생성된 컨트롤은 크롬 컨트롤로 처리되며, `destroyClientControls()` 메소드가 호출되어도 영향을 받지 않는다.

* **resizeHandler에서 모든 캐시 사이즈와 위치 데이터를 업데이트한다.**

	일반적으로 버그는 `rendered()`에서 사이즈와 위치를 계산(예, `getBounds()` 호출)하고, 그 결과를 캐시했지만, 컴포넌트 resize/reflow 시에 데이터를 갱신(refresh)하지 않을 때 발생한다.

* **초기에 `onChange`-형 이벤트를 전송하지 않는다.**
	
	비록 두 방식 모두 논쟁의 대상이 될 수 있지만 우리가 선택한 일반적인 방침은 속성의 초기 값을 셋팅할 때 `onChange`-형 이벤트를 전송하지 않고, 렌더링 후 값이 변경될 경우에만 전송하는 것이다.

* **유틸리티 기능을 재 개발하지 않는다.**

	모든 프레임워크 개발자 스스로가 `enyo.lang`, `enyo.dom`, `enyo,Component`, `enyo.UIComponent`, `enyo.Control`에서 제공되는 많은 유용한 크로스 플랫폼 호환(cross-platform-compatible) 유틸리티에 익숙해 져야 한다. 특정 컴포넌트가 다른 컴포넌트의 후손인지 체크하거나, 스타일 스트링을 배열로 변환하거나, 데이터 배열을 필터링 하는 기능이 필요하다면, 이미 다른 개발자가 프레임워크 내에 비슷한 동작을 수행하는 유틸리티를 잘 구축해 놓았을 수도 있다.

## I'm Contributing Code to the Enyo Framework...

Enyo 프레임워크에 contribute하고 있는 개발자라면, 다른 사람들이 사용하게 될 코드를 작성하게 될 것이다. 이러한 공유 코드를 작성하기 위해서 위에서 이미 언급한 내용 외에 몇 가지 팁을 설명한다.

* **주석처리 된 코드(commented-out code)를 커밋하지 않는다.**

	주석 처리 코드를 커밋하는 것은 테스트 중인 코드에서 주석을 제거하는 것을 잊었거나 코드에 대한 확신이 없기 때문에 주석 처리 된 코드를 제거하지 않은 것이다. 전자의 경우는 버그이나 후자의 경우처럼 확실하지 않은 코드는 커밋하지 말아야 한다.

	또한 버전 컨트롤 시스템에서 커밋 히스토리를 트랙킹하고 있으므로 히스토리(history)를 남기기 위한 용도로 주석 처리 된 코드를 남기지 말아야 한다. 코드를 제거한 후 다른 사람이 제거된 코드를 다시 추가하지 않기를 원한다면, 주석 처리한 코드를 남기지 말고 무엇이 왜 제거되었는지 설명하는 주석을 남긴다.

* **디버그 콘솔 로그 문을 커밋하지 않는다.**

* **모든 커밋에 Enyo DCO Signoff Line을 포함해야 한다.**

            Enyo-DCO-1.1-Signed-Off-By: <Your Name> (<your email address>)

* **단위 테스트를 포함해야 한다.**

	Enyo 라이브러리의 모든 주요 코드 변경에 대해서 하나 이상의 단위 테스트가 있어야 한다. 또한 새로운 UI kind는 모든 속성들을 동작시키는 예제가 적어도 하나 이상 필요하다.

* **예제를 심플하게 작성한다.**

    생성한 예제에서 위젯을 보기 좋게 꾸미거나 기능을 제대로 동작시키기 위해 커스텀 CSS/JavaScript를 많이 사용하면, 일반적으로 위젯을 사용하기 위해서 더 많은 작업이 필요할 것이다. 예제는 가능한 적은 커스텀 코드를 사용하면서도 컨트롤의 모든 기능을 동작할 수 있어야 한다. 

* **예제에서 사용되는 컴포넌트에 default 속성을 포함하지 않는다.**
 
	개발자들은 주로 예제에서 코드를 복사, 붙여넣기 해서 사용한다. 따라서 예제에서 kind에 속성을 정의하는 경우, 개발자는 동일한 작업을 수행해야 한다고 가정할 것이다.
 
