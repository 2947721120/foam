/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package foam.core;

import android.content.Context;

import foam.android.view.PropertyView;

public abstract class AbstractObjectProperty
    extends AbstractProperty
{

  public int compareValues(Object o1, Object o2) {
    if (o1 == o2) return 0;

    if (o1 instanceof Comparable) return ((Comparable) o1).compareTo(o2);
    if (o2 instanceof Comparable) return -((Comparable) o2).compareTo(o1);
    return 1;
  }

  public Object toNative(Object o)
  {
    return o;
  }

  public PropertyView createView(Context context) {
    // TODO(braden): Implement createView for Object properties.
    return null;
  }
}
