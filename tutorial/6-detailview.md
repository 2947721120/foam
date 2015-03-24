---
layout: tutorial
permalink: /tutorial/6-detailview/
tutorial: 6
---

Our last important task to make this app functional is to define the custom
template for `PhoneDetailView`.

## External Templates

For large or complex templates, it can be unwieldy to put them inline in the
class, as we've done for `PhoneCitationView` and `ControllerView`. FOAM allows
you to place templates in external files.

You specify that an external template exists by defining a `template` object in
your class that provides only its name. Update `PhoneDetailView` to look like
this:

{% highlight jsp %}
CLASS({
  name: 'PhoneDetailView',
  extendsModel: 'DetailView',
  templates: [
    { name: 'toHTML' }
  ]
});
{% endhighlight %}

When a class (`PhoneDetailView`) has a template with only a `name` (`toHTML`)
FOAM will look in the same directory for a file called
`PhoneDetailView_toHTML.ft`. (`.ft` is for "FOAM template".)

Create this file now, and add the following, which was adapted from the
AngularJS Phonecat tutorial. There's a lot here, but most of it is pretty
straightforward:

{% highlight js %}
{% raw %}
<%
  var phone = this.data;
  var imgId = this.nextID();
  function checkmark(b) { return b ? '\u2713' : '\u2718'; }
%>
<div class="phone-images">
  $$imageUrl{model_: 'foam.ui.ImageView', className: 'phone'}
</div>


<h1>{{phone.name}}</h1>

<p>{{phone.description}}</p>

<ul class="phone-thumbs">
<% phone.images.forEach(function(image) { %>
  <li>
    <img src="<%= image %>" id="<%= self.on('click', function() { phone.imageUrl = image; }) %>">
  </li>
<% }); %>
</ul>

<ul class="specs">
  <li>
    <span>Availability and Networks</span>
    <dl>
      <dt>Availability</dt>
      <% phone.availability.forEach(function(availability) { %> <dd><%= availability %></dd> <% }); %>
    </dl>
  </li>
  <li>
    <span>Battery</span>
    <dl>
      <dt>Type</dt>
      <dd><%= phone.battery.type %></dd>
      <dt>Talk Time</dt>
      <dd><%= phone.battery.talkTime %></dd>
      <dt>Standby time (max)</dt>
      <dd><%= phone.battery.standbyTime %></dd>
    </dl>
  </li>
  <li>
    <span>Storage and Memory</span>
    <dl>
      <dt>RAM</dt>
      <dd><%= phone.storage.ram %></dd>
      <dt>Internal Storage</dt>
      <dd><%= phone.storage.flash %></dd>
    </dl>
  </li>
  <li>
    <span>Connectivity</span>
    <dl>
      <dt>Network Support</dt>
      <dd><%= phone.connectivity.cell %></dd>
      <dt>WiFi</dt>
      <dd><%= phone.connectivity.wifi %></dd>
      <dt>Bluetooth</dt>
      <dd><%= phone.connectivity.bluetooth %></dd>
      <dt>Infrared</dt>
      <dd><%= checkmark(phone.connectivity.infrared) %></dd>
      <dt>GPS</dt>
      <dd><%= checkmark(phone.connectivity.gps) %></dd>
    </dl>
  </li>
  <li>
    <span>Android</span>
    <dl>
      <dt>OS Version</dt>
      <dd><%= phone.android.os %></dd>
      <dt>UI</dt>
      <dd><%= phone.android.ui %></dd>
    </dl>
  </li>
  <li>
    <span>Size and Weight</span>
    <dl>
      <dt>Dimensions</dt>
      <% phone.sizeAndWeight.dimensions.forEach(function(dim) { %> <dd><%= dim %></dd> <% }); %>
      <dt>Weight</dt>
      <dd><%= phone.sizeAndWeight.weight %></dd>
    </dl>
  </li>
  <li>
    <span>Display</span>
    <dl>
      <dt>Screen size</dt>
      <dd><%= phone.display.screenSize %></dd>
      <dt>Screen resolution</dt>
      <dd><%= phone.display.screenResolution %></dd>
      <dt>Touch screen</dt>
      <dd><%= checkmark(phone.display.touchScreen) %></dd>
    </dl>
  </li>
  <li>
    <span>Hardware</span>
    <dl>
      <dt>CPU</dt>
      <dd><%= phone.hardware.cpu %></dd>
      <dt>USB</dt>
      <dd><%= phone.hardware.usb %></dd>
      <dt>Audio / headphone jack</dt>
      <dd><%= phone.hardware.audioJack %></dd>
      <dt>FM Radio</dt>
      <dd><%= checkmark(phone.hardware.fmRadio) %></dd>
      <dt>Accelerometer</dt>
      <dd><%= checkmark(phone.hardware.accelerometer) %></dd>
    </dl>
  </li>
  <li>
    <span>Camera</span>
    <dl>
      <dt>Primary</dt>
      <dd><%= phone.camera.primary %></dd>
      <dt>Features</dt>
      <dd><%= phone.camera.features.join(', ') %></dd>
    </dl>
  </li>
  <li>
    <span>Additional Features</span>
    <dd><%= phone.additionalFeatures %></dd>
  </li>
</ul>
{% endraw %}
{% endhighlight %}

There's quite a lot there, but it's mostly the same pattern repeated for each
group of specs. A few points of interest:

- `this.nextID()` is a function all `View`s have, which returns a fresh
  identifier they can use as the ID of a DOM element.
- We can define new variables and functions in templates, like `checkmark`.

Once you've got this file saved, reload the app and navigate to a phone, and you
should see its information nicely laid out. Clicking a thumbnail image will load
the larger version.


## Finished

And that's the complete app! Hopefully you now have a better feel for the steps
of building a FOAM app, and are ready to start building your own.

See the [Appendix]({{ site.baseurl }}/tutorial/8-appendix) for further reading.

