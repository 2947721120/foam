/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
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

public abstract class AbstractDoubleProperty
    extends AbstractProperty
{

  public int compareValues(double d1, double d2) {
    return d1 == d2 ? 0 : d1 < d2 ? -1 : 1;
  }

  public double toNative(Object o)
  {
    return ((Double) o).doubleValue();
  }

  public PropertyView createView(Context context) {
    // TODO(braden): Implement createView for numeric types.
    return null;
  }
}